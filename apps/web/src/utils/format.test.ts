import { describe, expect, it } from "vitest";
import { formatAmount } from "./format";

/**
 * `Intl` separates the number and the symbol with a non-breaking space (and
 * sometimes a narrow one), so literal expectations here would carry invisible
 * characters that are impossible to review and easy to retype wrongly.
 */
const normalise = (value: string) => value.replace(/\s/gu, " ");

const format = (...args: Parameters<typeof formatAmount>) =>
  normalise(formatAmount(...args));

describe("formatAmount", () => {
  it("should format 100 EUR", async () => {
    expect(format(100)).toBe("100 €");
  });

  it("should format 1_000 EUR", async () => {
    expect(format(1_000)).toBe("1.000 €");
  });

  it("should format 10_000 EUR", async () => {
    expect(format(10_000)).toBe("10.000 €");
  });

  // Grouping and symbol placement follow the reader, not the currency. A
  // household reading 1.234 € reads 1.234 $ the same way, so USD in the
  // default locale is "1.000 $" rather than "$1,000".
  it("formats a foreign currency in the reader's locale", async () => {
    expect(format(100, "USD")).toBe("100 $");
    expect(format(1_000, "USD")).toBe("1.000 $");
  });

  it("formats USD the American way when that is the reader's locale", async () => {
    expect(format(1_000, "USD", "en-US")).toBe("$1,000");
  });

  // The picker offers every ISO code, so the formatter has to handle codes it
  // was never written for. These used to fall through to the EUR branch and
  // render as euros. Some render as a code rather than a symbol in de-DE,
  // which is correct — the point is that none of them come out as euros.
  it.each([
    ["JPY", "1.000 ¥"],
    ["HUF", "1.000 HUF"],
    ["PLN", "1.000 PLN"],
    ["BAM", "1.000 BAM"],
  ])("formats %s rather than falling back to euros", (currency, expected) => {
    expect(format(1_000, currency)).toBe(expected);
  });

  // A malformed code must not throw and blank the row.
  it("falls back to euros for an unknown code", async () => {
    expect(format(1_000, "NOTACURRENCY")).toBe("1.000 €");
  });
});
