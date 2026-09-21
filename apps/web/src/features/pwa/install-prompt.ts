/**
 * Catches Chrome's install prompt before React exists.
 *
 * `beforeinstallprompt` fires once, early — often as soon as the manifest and
 * service worker have been evaluated, which on a repeat visit is before the
 * React tree has mounted. The event does not replay and cannot be requested,
 * so a listener attached in a `useEffect` misses it and the one-tap button
 * never appears.
 *
 * That is what was happening in production: every installability criterion was
 * met and verified live, and the app was simply listening too late to hear
 * about it.
 *
 * So the listener lives at module scope and `index.tsx` imports this ahead of
 * `root.render`. React reads what was caught rather than racing to catch it.
 */

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    // Suppresses Chrome's own mini-infobar, so the offer appears where the
    // page puts it rather than over the content.
    event.preventDefault();
    deferred = event as BeforeInstallPromptEvent;
    notify();
  });

  window.addEventListener("appinstalled", () => {
    deferred = null;
    notify();
  });
}

export const getInstallPrompt = () => deferred;

/** Chrome refuses a second `prompt()` on the same event, so it is single use. */
export const consumeInstallPrompt = () => {
  deferred = null;
  notify();
};

export const subscribeToInstallPrompt = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
