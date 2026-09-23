import posthog from "posthog-js";
import Cookies from "js-cookie";

/**
 * Product analytics, behind a facade.
 *
 * This was Mixpanel until 2026-09-23. The vendor changed; nothing above this
 * file did, because every call site goes through `analytics.*` and the event
 * names are unchanged. That is the facade earning its keep — swapping the
 * provider was one file plus an import rename.
 *
 * ## Why PostHog
 *
 * Two reasons, neither about analytics quality:
 *
 * - **Feature flags and experiments on the free plan.** The next work is a
 *   paywall, tiers and trials, all of which want shipping to a fraction of
 *   users before all of them. Mixpanel puts experiments behind Enterprise.
 * - **EU data residency on the free plan.** Mixpanel gates regional residency
 *   behind Enterprise, so an EU-facing finance app was sending its users'
 *   financial behaviour to US infrastructure. `VITE_POSTHOG_HOST` should point
 *   at `https://eu.i.posthog.com`.
 */

// Cookie consent status
export const COOKIE_CONSENT_KEY = "cookie-consent";

// Check if user has consented to analytics
export const hasAnalyticsConsent = () => {
  const consent = Cookies.get(COOKIE_CONSENT_KEY);
  return consent === "true";
};

// Named for what PostHog calls it in its own UI: the project API key. It is a
// publishable key and ships in the bundle, like every `VITE_` value.
const KEY = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const HOST = import.meta.env.VITE_POSTHOG_HOST || "https://eu.i.posthog.com";

const LOCAL_HOSTNAMES = ["localhost", "127.0.0.1", "[::1]", "0.0.0.0"];

/**
 * Nothing is recorded from a machine running the app locally.
 *
 * Keyed on the hostname rather than the build mode, because `vite preview`
 * reports `MODE === "production"` — so a mode check would have let every local
 * preview of a production build write into the real project.
 *
 * This matters disproportionately at a small user count: development traffic
 * is not a rounding error against real usage, it is most of it. Every hot
 * reload is a pageview and every throwaway test expense is an `Expense
 * Created`, and the dataset ends up describing the person building the product
 * rather than the people using it.
 *
 * Set `VITE_POSTHOG_DEBUG=true` to capture from localhost anyway, which is how
 * to verify a new event actually fires before shipping it.
 */
const isLocal =
  typeof window !== "undefined" &&
  (LOCAL_HOSTNAMES.includes(window.location?.hostname) ||
    (window.location?.hostname ?? "").endsWith(".local"));

const ENABLED =
  Boolean(KEY) && (!isLocal || import.meta.env.VITE_POSTHOG_DEBUG === "true");

/**
 * Deliberately conservative for a product where every screen is someone's
 * money. The defaults are built for marketing sites, not finance apps.
 */
const options = {
  api_host: HOST,
  /*
   * Off. Autocapture records the text of whatever was clicked, which on these
   * screens is account balances, category names and amounts — financial detail
   * arriving in an analytics tool because nobody turned a default off. Every
   * event in this file is declared explicitly instead.
   */
  autocapture: false,
  /*
   * Off, and not a saving of effort: Sentry already records replays, and a
   * second tool capturing a DOM full of figures doubles the surface without
   * answering a question the funnel events do not.
   */
  disable_session_recording: true,
  // No person profile for logged-out visitors. They are a pageview, not a
  // person, and profiling them costs quota and creates data with no purpose.
  person_profiles: "identified_only" as const,
  capture_pageview: true,
  persistence: "localStorage" as const,
  debug: import.meta.env.MODE === "development",
};

const initAnalytics = () => {
  if (!ENABLED) {
    console.info(
      isLocal
        ? "Analytics off on localhost. Set VITE_POSTHOG_DEBUG=true to capture."
        : "PostHog key not found. Analytics disabled.",
    );
    return;
  }

  posthog.init(KEY, {
    ...options,
    // Starts silent and is opted in by the consent banner. Initialising
    // opted-out is what makes the banner's answer authoritative rather than a
    // race against page load.
    opt_out_capturing_by_default: !hasAnalyticsConsent(),
  });
};

// Handle consent changes
export const handleAnalyticsConsent = (hasConsent: boolean) => {
  if (!ENABLED) return;

  if (hasConsent) {
    posthog.opt_in_capturing();
  } else {
    posthog.opt_out_capturing();
  }
};

/** Every method re-checks consent, so a stale opt-in cannot leak events. */
const enabled = () => ENABLED && hasAnalyticsConsent();

export const analytics = {
  init: initAnalytics,

  identify: (userId: string) => {
    if (enabled()) posthog.identify(userId);
  },

  setUserProperties: (
    properties: Record<string, string | number | boolean>,
  ) => {
    if (enabled()) posthog.setPersonProperties(properties);
  },

  track: (
    eventName: string,
    properties?: Record<string, string | number | boolean>,
  ) => {
    if (!enabled()) return;

    posthog.capture(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
      app_version: import.meta.env.VITE_APP_VERSION || "0.1.0",
    });
  },

  trackPageView: (
    pageName: string,
    properties?: Record<string, string | number | boolean>,
  ) => {
    analytics.track("Page View", { page_name: pageName, ...properties });
  },

  // Financial app specific events
  trackCategoryCreated: (categoryName: string) => {
    analytics.track("Category Created", { category_name: categoryName });
  },

  trackSubcategoryCreated: (
    subcategoryName: string,
    categoryName: string,
    budgetAmount: number,
  ) => {
    analytics.track("Subcategory Created", {
      subcategory_name: subcategoryName,
      category_name: categoryName,
      budget_amount: budgetAmount,
    });
  },

  trackExpenseCreated: (
    amount: number,
    categoryName: string,
    subcategoryName: string,
  ) => {
    analytics.track("Expense Created", {
      amount,
      category_name: categoryName,
      subcategory_name: subcategoryName,
    });
  },

  trackSavingGoalCreated: (
    goalName: string,
    goalAmount: number,
    targetDate: string,
  ) => {
    analytics.track("Saving Goal Created", {
      goal_name: goalName,
      goal_amount: goalAmount,
      target_date: targetDate,
    });
  },

  trackInvestmentCreated: (
    investmentName: string,
    initialAmount: number,
    currency: string,
  ) => {
    analytics.track("Investment Created", {
      investment_name: investmentName,
      initial_amount: initialAmount,
      currency,
    });
  },

  /*
   * The household funnel.
   *
   * None of this was tracked, which meant the one question the pricing rests
   * on — what share of accounts ever become a household — could not be
   * answered from analytics at all. These five events are that funnel, in
   * order, and each step is where people drop out:
   *
   *   Group Created → Invite Sent → Invite Accepted → Category Shared
   *                                                 → Partner Expense Created
   *
   * The last is the only event proving the household is *real* rather than
   * merely set up, so it is the one worth optimising against.
   *
   * No email addresses here. The invite funnel is about counts, and the
   * invitee has not consented to anything yet.
   */
  trackGroupCreated: (groupName: string) => {
    analytics.track("Group Created", { group_name: groupName });
  },

  trackGroupInviteSent: (memberCount: number) => {
    // How many people are already in the group when another is invited, which
    // separates "setting up a couple" from "adding a third".
    analytics.track("Invite Sent", { member_count: memberCount });
  },

  trackGroupInviteAccepted: () => {
    analytics.track("Invite Accepted");
  },

  trackCategoryShared: (shared: boolean) => {
    // Unsharing is the tell for a household quietly coming apart, so both
    // directions land on one event rather than only the happy path.
    analytics.track("Category Shared", { shared });
  },

  /**
   * An expense entered by someone other than the person who owns the category.
   * The moment a shared budget stops being one person's spreadsheet.
   */
  trackPartnerExpenseCreated: () => {
    analytics.track("Partner Expense Created");
  },

  trackUserSignup: (email: string) => {
    analytics.track("User Signup", { email });
  },

  trackUserLogin: (email: string) => {
    analytics.track("User Login", { email });
  },

  trackUserLogout: () => {
    analytics.track("User Logout");
  },

  // Reset user data (call on logout)
  reset: () => {
    if (enabled()) posthog.reset();
  },
};

export default analytics;
