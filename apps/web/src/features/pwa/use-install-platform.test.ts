import { describe, it, expect } from "vitest";
import { detectInstallPlatform, InstallEnvironment } from "./use-install-platform";

/**
 * The iOS branch was wrong in production: it sent anyone on Chrome, Firefox or
 * Edge for iOS off to "open this in Safari", on the basis of a restriction
 * Apple lifted in iOS 16.4. That regression, and the two cases where the offer
 * must not appear at all, are what these cover.
 */

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) Safari/604.1";
const IPHONE_CHROME = `${IPHONE} CriOS/129.0.0.0`;
const ANDROID = "Mozilla/5.0 (Linux; Android 14; Pixel 8) Chrome/129.0.0.0 Mobile";
const MAC = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15";

const env = (o: Partial<InstallEnvironment> = {}): InstallEnvironment => ({
  hostname: "app.yourmonthly.app",
  userAgent: ANDROID,
  standalone: false,
  maxTouchPoints: 0,
  ...o,
});

describe("detectInstallPlatform", () => {
  it.each([
    ["Android", { userAgent: ANDROID }, "android"],
    ["iOS Safari", { userAgent: IPHONE }, "ios"],
    // The regression: Chrome on iOS can add to the home screen too.
    ["iOS Chrome", { userAgent: IPHONE_CHROME }, "ios"],
    // iPadOS 13+ claims to be a Mac; touch points are the only tell.
    ["iPad", { userAgent: MAC, maxTouchPoints: 5 }, "ios"],
    ["desktop", { userAgent: MAC }, "none"],
    ["already installed", { standalone: true }, "none"],
    // `start_url` is same-origin, so installing here would pin the sales page.
    ["marketing domain", { hostname: "yourmonthly.app" }, "none"],
    ["unreadable hostname", { hostname: "" }, "none"],
  ])("%s", (_case, overrides, expected) => {
    expect(detectInstallPlatform(env(overrides))).toBe(expected);
  });
});
