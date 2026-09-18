/**
 * Fallback formatting locale.
 *
 * Grouping and symbol placement belong to the reader, not to the money: a
 * household in Zagreb reads 1.234 € whether the figure is euros or dollars.
 * So the locale follows the user, and `de-DE` is only the fallback for the
 * markets this launches in.
 *
 * This becomes `User.locale` once that column exists; until then callers may
 * pass one explicitly, which is mainly how the tests stay deterministic.
 */
export const DEFAULT_DISPLAY_LOCALE = "de-DE";

/** Constructing a formatter is comparatively costly and lists re-render per row. */
const formatters = new Map<string, Intl.NumberFormat>();

/**
 * Formats an amount in any ISO 4217 currency.
 *
 * This used to be an if-chain over EUR, USD, GBP and CAD, with every other
 * currency falling through to the EUR branch — so a user who picked AUD or JPY
 * saw their money rendered in euros. `Intl` handles every currency, including
 * those with no minor unit, so which currencies to offer is now a product
 * decision rather than something the formatter constrains.
 *
 * Whole units, no minor units: household budgeting does not need cents, and
 * dropping them keeps long columns readable.
 */
export const formatAmount = (
  amount: number,
  userCurrency?: string,
  locale: string = DEFAULT_DISPLAY_LOCALE,
): string => {
  const currency = userCurrency || "EUR";
  const key = `${locale}:${currency}`;

  let formatter = formatters.get(key);
  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      });
    } catch {
      // An unknown or malformed code would otherwise throw and blank the row.
      formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      });
    }
    formatters.set(key, formatter);
  }

  return formatter.format(amount);
};
