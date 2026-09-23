import CookieConsent from "react-cookie-consent";
import { handleAnalyticsConsent, COOKIE_CONSENT_KEY } from "@/utils/analytics";
import { tokens } from "@/theme/tokens";

/**
 * The analytics consent banner, rendered once for the whole app.
 *
 * It used to live inside the marketing welcome page, which meant it only
 * existed on one route of one domain. Everyone who arrived anywhere else —
 * every returning user opening `app.yourmonthly.app`, and **every invitee
 * following an invite link** — was never asked, and since `analytics.track`
 * refuses to fire without consent, none of them were ever counted.
 *
 * That biased the household funnel exactly where it mattered: invitees arrive
 * deep-linked, so `Invite Accepted` was the step least likely to be recorded.
 *
 * Nothing about the consent model changed. It is still opt-in, still declines
 * cleanly, and still gates every call in `utils/analytics.ts`. It is now simply
 * possible to answer it from wherever you landed.
 */
export const CookieConsentBanner = () => {
  /*
   * One answer across both hosts.
   *
   * The marketing site and the app are separate subdomains, so a cookie set on
   * the default host does not travel between them — accept on the landing page,
   * sign in, and you would be asked again. A parent-domain cookie is one
   * decision for both.
   *
   * Only in production: a `.yourmonthly.app` cookie cannot be set from
   * localhost, and attempting it silently drops the cookie, which would leave
   * the banner permanently unanswerable in development.
   */
  const { hostname } = window.location;
  const sharedDomain = hostname.endsWith("yourmonthly.app")
    ? { domain: ".yourmonthly.app" }
    : undefined;

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName={COOKIE_CONSENT_KEY}
      extraCookieOptions={sharedDomain}
      style={{
        background: tokens.ink.primary,
        fontSize: tokens.fontSize.sm,
        padding: "5px",
        // Above the fixed month toolbar, which owns the bottom edge on phones,
        // and clear of the iOS home indicator.
        zIndex: 1300,
        paddingBottom: "calc(5px + env(safe-area-inset-bottom, 0px))",
      }}
      buttonStyle={{
        backgroundColor: tokens.accent.main,
        color: tokens.accent.contrastText,
        fontSize: tokens.fontSize.sm,
        padding: "8px 18px",
        borderRadius: "4px",
        fontWeight: "500",
      }}
      declineButtonStyle={{
        backgroundColor: "transparent",
        color: tokens.ground,
        fontSize: tokens.fontSize.sm,
        padding: "8px 18px",
        borderRadius: "4px",
        border: `1px solid ${tokens.ground}`,
        fontWeight: "500",
      }}
      expires={365}
      onAccept={() => {
        handleAnalyticsConsent(true);
      }}
      onDecline={() => {
        handleAnalyticsConsent(false);
      }}
    >
      This website uses cookies to enhance your experience and provide
      analytics. By clicking "Accept", you consent to our use of cookies for
      analytics purposes. View our{" "}
      <a
        href="/privacy"
        style={{ color: tokens.section[4], textDecoration: "underline" }}
      >
        Privacy Policy
      </a>{" "}
      and{" "}
      <a
        href="/terms"
        style={{ color: tokens.section[4], textDecoration: "underline" }}
      >
        Terms &amp; Conditions
      </a>{" "}
      for more details.
    </CookieConsent>
  );
};
