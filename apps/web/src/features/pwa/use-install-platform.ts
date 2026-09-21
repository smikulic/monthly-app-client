/**
 * Which install instructions, if any, this visitor should be shown.
 *
 * Deliberately narrow: it answers "what should we tell this person to tap",
 * not "what browser is this". User-agent sniffing is a poor way to detect
 * capabilities, but adding to the home screen genuinely *is* a per-platform
 * ritual with no feature to detect — iOS has no install API at all, and the
 * gesture differs between the two platforms.
 */
import { useCallback, useSyncExternalStore } from "react";
import {
  consumeInstallPrompt,
  getInstallPrompt,
  subscribeToInstallPrompt,
} from "./install-prompt";

export type InstallPlatform =
  | "ios"
  | "android"
  /** Already installed, a desktop browser, or the marketing site. */
  | "none";

/**
 * Whether this origin serves the app rather than the marketing site.
 *
 * A manifest's `start_url` must be same-origin, and ours resolves to whatever
 * host served it — so an install from `yourmonthly.app` pins the *sales page*
 * to someone's home screen, and there is no way to point it at the app from
 * there. The offer therefore only belongs on the app origin.
 *
 * Localhost counts, so a production build can be previewed locally.
 */
const servesApp = (hostname: string) =>
  hostname.split(".").slice(0, -2).join(".") === "app" ||
  ["localhost", "127.0.0.1", "[::1]", "0.0.0.0"].includes(hostname) ||
  hostname.endsWith(".local");

export interface InstallEnvironment {
  hostname: string;
  userAgent: string;
  /** Already added to the home screen. */
  standalone: boolean;
  /** iPadOS 13+ reports itself as a Mac; touch points are the only tell. */
  maxTouchPoints: number;
}

/**
 * Pure, and takes its environment as an argument rather than reading globals.
 *
 * Partly so it can be tested at all — `setupTests.ts` replaces
 * `window.location` wholesale and non-configurably, so a version that read
 * `location.hostname` directly could never be exercised — and partly because
 * every input here is a thing this function should be explicit about.
 */
export const detectInstallPlatform = ({
  hostname,
  userAgent,
  standalone,
  maxTouchPoints,
}: InstallEnvironment): InstallPlatform => {
  if (!servesApp(hostname)) return "none";
  if (standalone) return "none";

  const isIpadOS = /macintosh/i.test(userAgent) && maxTouchPoints > 1;

  /*
   * One branch for all of iOS, Safari or not.
   *
   * This used to send Chrome, Firefox and Edge users off to "open this in
   * Safari", which has been wrong since iOS 16.4 opened Add to Home Screen to
   * third-party browsers — Chrome has offered it since 2023. The gesture is
   * identical everywhere (Share, then Add to Home Screen); only the Share
   * button's position differs, which the copy covers.
   */
  if (/iphone|ipad|ipod/i.test(userAgent) || isIpadOS) return "ios";

  return /android/i.test(userAgent) ? "android" : "none";
};

const readEnvironment = (): InstallEnvironment => ({
  // Defensive: `location` is replaced in tests and can be a bare stub. An
  // unknown host is treated as the marketing site, which shows nothing.
  hostname: window.location?.hostname ?? "",
  userAgent: window.navigator?.userAgent ?? "",
  standalone:
    window.matchMedia?.("(display-mode: standalone)").matches === true ||
    (window.navigator as { standalone?: boolean })?.standalone === true,
  maxTouchPoints: window.navigator?.maxTouchPoints ?? 0,
});

export const useInstallPlatform = () => {
  /*
   * Read once, not in an effect. `detect()` is a pure read of `navigator` and
   * `matchMedia`, and resolving it after mount meant the card rendered its
   * "none" state first and then swapped — a flash of nothing on the one
   * surface whose whole job is to be noticed.
   */
  const platform =
    typeof window === "undefined"
      ? "none"
      : detectInstallPlatform(readEnvironment());

  // The prompt is caught at module scope by `install-prompt.ts`, long before
  // this hook runs. See the note there.
  const promptEvent = useSyncExternalStore(
    subscribeToInstallPrompt,
    getInstallPrompt,
    () => null,
  );

  const install = useCallback(async () => {
    const event = getInstallPrompt();
    if (!event) return;

    await event.prompt();
    // Single use: Chrome rejects a second `prompt()` on the same event.
    consumeInstallPrompt();
  }, []);

  return {
    platform,
    /** Present only when the browser offered a one-tap install. */
    install: promptEvent ? install : null,
  };
};
