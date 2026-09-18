export interface CurrencyOption {
  code: string;
  /** Localised name, e.g. "Euro" or "US-Dollar". */
  name: string;
  /** "EUR — Euro", for searching and display. */
  label: string;
}

/**
 * Surfaced first in the picker: the roadmap markets and their neighbours, plus
 * the currencies an international household in Zagreb or Berlin is most likely
 * to track in. Everything else follows alphabetically.
 *
 * Not a restriction — every ISO code is still selectable. This is only about
 * what you see before typing.
 */
const COMMON = [
  "EUR",
  "USD",
  "GBP",
  "CHF",
  "BAM",
  "RSD",
  "HUF",
  "PLN",
  "CZK",
  "RON",
  "BGN",
  "SEK",
  "NOK",
  "DKK",
];

/**
 * Every ISO 4217 currency, named in the given locale.
 *
 * Generated rather than hand-listed. The hardcoded list held six arbitrary
 * currencies — no regional ones at all — and two of them (AUD, JPY) rendered
 * as euros because the formatter did not know them.
 *
 * `Intl.DisplayNames` localises the names for free, so once the app speaks
 * Croatian the picker does too.
 */
export const getCurrencyOptions = (locale?: string): CurrencyOption[] => {
  let codes: string[];
  try {
    codes = Intl.supportedValuesOf("currency");
  } catch {
    // Very old runtimes lack supportedValuesOf; the common set still works.
    codes = COMMON;
  }

  let displayNames: Intl.DisplayNames | undefined;
  try {
    displayNames = new Intl.DisplayNames(locale ? [locale] : undefined, {
      type: "currency",
    });
  } catch {
    displayNames = undefined;
  }

  const toOption = (code: string): CurrencyOption => {
    const name = displayNames?.of(code) ?? code;
    return {
      code,
      name,
      // The code leads, because it is what people search by and what the rest
      // of the app shows.
      label: name === code ? code : `${code} — ${name}`,
    };
  };

  const common = COMMON.filter((code) => codes.includes(code)).map(toOption);
  const rest = codes
    .filter((code) => !COMMON.includes(code))
    .map(toOption)
    .sort((a, b) => a.code.localeCompare(b.code));

  return [...common, ...rest];
};
