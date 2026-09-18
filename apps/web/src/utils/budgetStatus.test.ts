import { describe, expect, it } from "vitest";
import { getBudgetStatus } from "./budgetStatus";

/**
 * Shared by the category row and the subcategory rows beneath it, so a
 * disagreement here shows up as a category reading "under budget" above a
 * child reading "over".
 */
describe("getBudgetStatus", () => {
  describe("rollover off — the figure is the month's budget", () => {
    it("is not over while spend is within it", () => {
      const status = getBudgetStatus({
        showRollover: false,
        budgetForMonth: 500,
        rolloverRemaining: 900,
        spent: 340,
      });

      expect(status).toMatchObject({
        budgetValue: 500,
        over: false,
        label: "budget",
      });
    });

    it("is over once spend passes it", () => {
      expect(
        getBudgetStatus({
          showRollover: false,
          budgetForMonth: 500,
          rolloverRemaining: 900,
          spent: 640,
        }).over,
      ).toBe(true);
    });
  });

  describe("rollover on — the figure is what remains", () => {
    it("is not over while something remains", () => {
      expect(
        getBudgetStatus({
          showRollover: true,
          budgetForMonth: 500,
          rolloverRemaining: 160,
          spent: 640,
        }),
      ).toMatchObject({ budgetValue: 160, over: false, label: "left" });
    });

    // Spend exceeding the month's budget is not over budget here: earlier
    // months may have accrued enough to cover it, which is the whole point of
    // rollover.
    it("is over only once the remainder goes negative", () => {
      expect(
        getBudgetStatus({
          showRollover: true,
          budgetForMonth: 500,
          rolloverRemaining: -180,
          spent: 680,
        }).over,
      ).toBe(true);
    });
  });

  // A month before the schedule opened has no budget to be over.
  it("reports nothing started before the schedule opens", () => {
    const status = getBudgetStatus({
      showRollover: false,
      budgetForMonth: 0,
      rolloverRemaining: 0,
      spent: 120,
    });

    expect(status.hasStarted).toBe(false);
    expect(status.over).toBe(false);
  });
});
