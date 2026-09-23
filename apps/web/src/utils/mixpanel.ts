import mixpanel from "mixpanel-browser";
import Cookies from "js-cookie";

// Cookie consent status
export const COOKIE_CONSENT_KEY = "cookie-consent";

// Check if user has consented to analytics
export const hasAnalyticsConsent = () => {
  const consent = Cookies.get(COOKIE_CONSENT_KEY);
  return consent === "true";
};

// Initialize Mixpanel
const initMixpanel = () => {
  const token = import.meta.env.VITE_MIXPANEL_TOKEN;

  if (token) {
    // Only initialize if user has consented
    if (hasAnalyticsConsent()) {
      mixpanel.init(token, {
        debug: import.meta.env.MODE === "development",
        track_pageview: true,
        persistence: "localStorage",
        ignore_dnt: false,
      });
    } else {
      // If no consent, opt out
      mixpanel.init(token, {
        opt_out_tracking_by_default: true,
        debug: import.meta.env.MODE === "development",
      });
    }
  } else {
    console.warn("Mixpanel token not found. Analytics disabled.");
  }
};

// Handle consent changes
export const handleAnalyticsConsent = (hasConsent: boolean) => {
  const token = import.meta.env.VITE_MIXPANEL_TOKEN;

  if (token) {
    if (hasConsent) {
      // Opt in to tracking
      mixpanel.opt_in_tracking();
      // Re-initialize with full settings
      mixpanel.init(token, {
        debug: import.meta.env.MODE === "development",
        track_pageview: true,
        persistence: "localStorage",
        ignore_dnt: false,
      });
    } else {
      // Opt out of tracking
      mixpanel.opt_out_tracking();
    }
  }
};

// Analytics service
export const analytics = {
  // Initialize Mixpanel
  init: initMixpanel,

  // Identify user
  identify: (userId: string) => {
    if (import.meta.env.VITE_MIXPANEL_TOKEN && hasAnalyticsConsent()) {
      mixpanel.identify(userId);
    }
  },

  // Set user properties
  setUserProperties: (
    properties: Record<string, string | number | boolean>,
  ) => {
    if (import.meta.env.VITE_MIXPANEL_TOKEN && hasAnalyticsConsent()) {
      mixpanel.people.set(properties);
    }
  },

  // Track events
  track: (
    eventName: string,
    properties?: Record<string, string | number | boolean>,
  ) => {
    if (import.meta.env.VITE_MIXPANEL_TOKEN && hasAnalyticsConsent()) {
      mixpanel.track(eventName, {
        ...properties,
        timestamp: new Date().toISOString(),
        app_version: import.meta.env.VITE_APP_VERSION || "0.1.0",
      });
    }
  },

  // Track page views
  trackPageView: (
    pageName: string,
    properties?: Record<string, string | number | boolean>,
  ) => {
    analytics.track("Page View", {
      page_name: pageName,
      ...properties,
    });
  },

  // Financial app specific events
  trackCategoryCreated: (categoryName: string) => {
    analytics.track("Category Created", {
      category_name: categoryName,
    });
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
   * The last one is the only event that proves the household is *real* rather
   * than merely set up, so it is the one worth optimising against.
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
    // Unsharing is the tell for a household that is quietly coming apart, so
    // both directions land on one event rather than only the happy path.
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
    analytics.track("User Signup", {
      email,
    });
  },

  trackUserLogin: (email: string) => {
    analytics.track("User Login", {
      email,
    });
  },

  trackUserLogout: () => {
    analytics.track("User Logout");
  },

  // Reset user data (call on logout)
  reset: () => {
    if (import.meta.env.VITE_MIXPANEL_TOKEN && hasAnalyticsConsent()) {
      mixpanel.reset();
    }
  },
};

export default analytics;
