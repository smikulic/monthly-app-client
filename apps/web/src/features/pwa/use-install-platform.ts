/**
 * Which install instructions, if any, this visitor should be shown.
 *
 * Deliberately narrow: it answers "what should we tell this person to tap",
 * not "what browser is this". User-agent sniffing is a poor way to detect
 * capabilities, but adding to the home screen genuinely *is* a per-platform
 * ritual with no feature to detect — iOS has no install API at all, and the
 * gesture differs between the two platforms.
 */
import { useEffect, useState } from "react";

export type InstallPlatform =
  | "ios-safari"
  /** iOS, but in Chrome/Firefox/Edge, which cannot add to the home screen. */
  | "ios-other-browser"
  | "android"
  /** Already installed, or a desktop browser: nothing useful to say. */
  | "none";

/**
 * Chrome fires this when a site meets its installability bar, letting us offer
 * a real one-tap button instead of instructions.
 *
 * It does not fire today: Chrome requires a service worker with a fetch
 * handler and this app has none (see `public/manifest.json` — there is no
 * `sw.js` beside it). The listener is here anyway so that adding one upgrades
 * Android to a single tap with no further work, rather than leaving a better
 * experience switched off behind a code change nobody remembers to make.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const detect = (): InstallPlatform => {
  if (typeof window === "undefined") return "none";

  const ua = window.navigator.userAgent;

  // Already installed: standalone display mode, or Safari's own legacy flag.
  const installed =
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true;
  if (installed) return "none";

  // iPadOS 13+ reports itself as a Mac, so the touch count is the only way to
  // tell an iPad from a laptop.
  const isIpadOS =
    /macintosh/i.test(ua) && (window.navigator.maxTouchPoints ?? 0) > 1;
  const isIos = /iphone|ipad|ipod/i.test(ua) || isIpadOS;

  if (isIos) {
    // Add to Home Screen is a Safari feature. The other iOS browsers are
    // Safari underneath but do not expose it, so sending someone to look for
    // a Share sheet item that is not there is worse than saying nothing.
    return /crios|fxios|edgios|opt\//i.test(ua)
      ? "ios-other-browser"
      : "ios-safari";
  }

  return /android/i.test(ua) ? "android" : "none";
};

export const useInstallPlatform = () => {
  // Resolved after mount rather than during render: `matchMedia` and
  // `maxTouchPoints` are browser-only, and this page is the one that would be
  // pre-rendered first if it ever moves off the SPA.
  const [platform, setPlatform] = useState<InstallPlatform>("none");
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setPlatform(detect());

    const onBeforeInstallPrompt = (event: Event) => {
      // Suppresses Chrome's own mini-infobar so the page can offer the install
      // at a moment that makes sense instead.
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setPlatform("none");
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  /** Present only when the browser offered a one-tap install. */
  const install = promptEvent
    ? async () => {
        await promptEvent.prompt();
        // Single use: Chrome will not let the same event be prompted twice.
        setPromptEvent(null);
      }
    : null;

  return { platform, install };
};
