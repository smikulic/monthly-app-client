import { DEFAULT_DISPLAY_LOCALE } from "@/utils/format";

export const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN_KEY;
export const AUTH_TOKEN_USER = import.meta.env.VITE_AUTH_TOKEN_USER_KEY;
export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
export const API_PRODUCTION = import.meta.env.VITE_API_PRODUCTION;

/** Feedback form, linked from the account menu. */
export const FEEDBACK_FORM_URL = "https://forms.gle/a59QBuddeMJf2S64A";

/**
 * Short month names for the chart's x-axis, in the reader's language.
 *
 * Hardcoded English until now, which was a latent bug rather than a stylistic
 * one: everything else on the page already formats through `Intl` and follows
 * the user, so an otherwise Croatian or German interface printed "Jan Feb Mar"
 * across the bottom of its only chart.
 *
 * Built once at module load — the list does not change while the tab is open,
 * and `DateTimeFormat` is comparatively expensive to construct.
 */
const monthNameFormatter = new Intl.DateTimeFormat(DEFAULT_DISPLAY_LOCALE, {
  month: "short",
});

export const months = Array.from({ length: 12 }, (_, month) =>
  // A fixed year and the first of the month: only the month name is formatted,
  // so which year this is never matters or shows.
  monthNameFormatter.format(new Date(2020, month, 1)),
);
