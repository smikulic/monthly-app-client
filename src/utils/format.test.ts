// import { mockReplace } from "../setupTests";
import { formatAmount } from "./format";

describe("formatAmount", () => {
  it("should format 100 euro", async () => {
    const formattedAmount = formatAmount(100);
    expect(formattedAmount).toBe("100 €");
  });

  it("should format 1_000 euro", async () => {
    const formattedAmount = formatAmount(1_000);
    expect(formattedAmount).toBe("1,000 €");
  });
  
  it("should format 10_000 euro", async () => {
    const formattedAmount = formatAmount(10_000);
    expect(formattedAmount).toBe("10,000 €");
  });
});
