import { describe, expect, it } from "vitest";
import { formatAmount } from "./format";
// import { mockReplace } from "../setupTests";

describe("formatAmount", () => {
  it("should format 100 EUR", async () => {
    const formattedAmount = formatAmount(100);
    expect(formattedAmount).toBe("100 €");
  });

  it("should format 1_000 EUR", async () => {
    const formattedAmount = formatAmount(1_000);
    expect(formattedAmount).toBe("1.000 €");
  });

  it("should format 10_000 EUR", async () => {
    const formattedAmount = formatAmount(10_000);
    expect(formattedAmount).toBe("10.000 €");
  });

  it("should format 100 USD", async () => {
    const formattedAmount = formatAmount(100, "USD");
    expect(formattedAmount).toBe("$100");
  });

  it("should format 1_000 USD", async () => {
    const formattedAmount = formatAmount(1_000, "USD");
    expect(formattedAmount).toBe("$1,000");
  });
});
