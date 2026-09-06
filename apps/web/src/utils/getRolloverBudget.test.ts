import { describe, expect, it } from "vitest";
import {
  getAccruedBudget,
  getRemainingRolloverBudget,
  getRolloverBudget,
} from "./getRolloverBudget";

describe("getRolloverBudget", () => {
  const budgetAmount = 100;
  const rolloverDate = new Date(
    "Wed Oct 10 2023 10:00:00 GMT+0200 (Central European Summer Time)"
  );

  describe("when we are still in a current month", () => {
    const currentDate = new Date(
      "Wed Oct 10 2023 10:00:00 GMT+0200 (Central European Summer Time)"
    );
    const rolloverBudget = getRolloverBudget({
      currentDate,
      rolloverDate,
      budgetAmount,
    });

    it("returns 1x the value of defined budget", () => {
      expect(rolloverBudget).toBe(budgetAmount);
    });
  });

  describe("when 2 months have passed", () => {
    const currentDate = new Date(
      "Wed Dec 10 2023 10:00:00 GMT+0200 (Central European Summer Time)"
    );
    const rolloverBudget = getRolloverBudget({
      currentDate,
      rolloverDate,
      budgetAmount,
    });

    it("returns 3x the value of defined budget", () => {
      expect(rolloverBudget).toBe(budgetAmount * 3);
    });
  });

  describe("when 12 months have passed", () => {
    const currentDate = new Date(
      "Wed Oct 10 2024 10:00:00 GMT+0200 (Central European Summer Time)"
    );
    const rolloverBudget = getRolloverBudget({
      currentDate,
      rolloverDate,
      budgetAmount,
    });

    it("returns 13x the value of defined budget", () => {
      expect(rolloverBudget).toBe(budgetAmount * 13);
    });
  });
});

describe("getRemainingRolloverBudget", () => {
  const budgetAmount = 100;
  const rolloverDate = new Date(
    "Wed Oct 10 2023 10:00:00 GMT+0200 (Central European Summer Time)"
  );

  describe("when we are still in the current month", () => {
    const currentDate = new Date(
      "Wed Oct 10 2023 10:00:00 GMT+0200 (Central European Summer Time)"
    );
    const totalExpensesSinceRollover = 0;
    const remainingBudget = getRemainingRolloverBudget({
      currentDate,
      rolloverDate,
      budgetAmount,
      totalExpensesSinceRollover,
    });

    it("returns 1x the value of the defined budget", () => {
      // With no months passed, the accrued budget is 1x budgetAmount.
      expect(remainingBudget).toBe(budgetAmount);
    });
  });

  describe("when 2 months have passed", () => {
    const currentDate = new Date(
      "Wed Dec 10 2023 10:00:00 GMT+0200 (Central European Summer Time)"
    );
    const totalExpensesSinceRollover = 0;
    const remainingBudget = getRemainingRolloverBudget({
      currentDate,
      rolloverDate,
      budgetAmount,
      totalExpensesSinceRollover,
    });

    it("returns 3x the value of the defined budget", () => {
      // monthsPassed = 2, therefore, total accrued budget = (2 + 1) * budgetAmount = 3 x budgetAmount.
      expect(remainingBudget).toBe(budgetAmount * 3);
    });
  });

  describe("when 12 months have passed", () => {
    const currentDate = new Date(
      "Wed Oct 10 2024 10:00:00 GMT+0200 (Central European Summer Time)"
    );
    const totalExpensesSinceRollover = 0;
    const remainingBudget = getRemainingRolloverBudget({
      currentDate,
      rolloverDate,
      budgetAmount,
      totalExpensesSinceRollover,
    });

    it("returns 13x the value of the defined budget", () => {
      // monthsPassed = 12 so total accrued budget = (12 + 1) * budgetAmount = 13 x budgetAmount.
      expect(remainingBudget).toBe(budgetAmount * 13);
    });
  });

  describe("when 2 months have passed with some expenses", () => {
    const currentDate = new Date(
      "Wed Dec 10 2023 10:00:00 GMT+0200 (Central European Summer Time)"
    );
    // Suppose the total expenses incurred since the rollover is 50.
    const totalExpensesSinceRollover = 50;
    const remainingBudget = getRemainingRolloverBudget({
      currentDate,
      rolloverDate,
      budgetAmount,
      totalExpensesSinceRollover,
    });

    it("returns the accrued budget minus the expenses", () => {
      // Accrued budget = (2 + 1) * 100 = 300.
      // After deducting expenses: 300 - 50 = 250.
      expect(remainingBudget).toBe(250);
    });
  });
});

describe("getAccruedBudget", () => {
  // The case the schedule exists for: groceries at 100 from June 2023, raised
  // to 700 from January 2026 when a second person joined the household.
  const periods = [
    { amount: 100, validFrom: new Date(2023, 5, 1) },
    { amount: 700, validFrom: new Date(2026, 0, 1) },
  ];

  it("costs each span at the amount that was in force", () => {
    // Jun 2023 to Dec 2025 is 31 months at 100, then Jan to Mar 2026 is 3 at 700.
    expect(
      getAccruedBudget({ periods, currentDate: new Date(2026, 2, 15) })
    ).toBe(31 * 100 + 3 * 700);
  });

  it("does not let a later amount rewrite earlier months", () => {
    // Viewed in Dec 2025 the raise has not happened, so it contributes nothing.
    expect(
      getAccruedBudget({ periods, currentDate: new Date(2025, 11, 31) })
    ).toBe(31 * 100);
  });

  it("ignores periods that have not started yet", () => {
    expect(
      getAccruedBudget({ periods, currentDate: new Date(2023, 5, 30) })
    ).toBe(100);
  });

  it("accrues nothing before the schedule opens", () => {
    // Previously this went negative: monthsPassed was never clamped.
    expect(
      getAccruedBudget({ periods, currentDate: new Date(2023, 0, 1) })
    ).toBe(0);
  });

  it("matches the flat calculation when there is only one period", () => {
    const single = [{ amount: 100, validFrom: new Date(2023, 9, 10) }];

    expect(
      getAccruedBudget({ periods: single, currentDate: new Date(2024, 9, 10) })
    ).toBe(
      getRolloverBudget({
        currentDate: new Date(2024, 9, 10),
        rolloverDate: new Date(2023, 9, 10),
        budgetAmount: 100,
      })
    );
  });

  it("sorts periods that arrive out of order", () => {
    const reversed = [periods[1], periods[0]];

    expect(
      getAccruedBudget({ periods: reversed, currentDate: new Date(2026, 2, 15) })
    ).toBe(31 * 100 + 3 * 700);
  });

  it("returns zero for an empty schedule", () => {
    expect(getAccruedBudget({ periods: [], currentDate: new Date() })).toBe(0);
  });
});

describe("getRemainingRolloverBudget with a schedule", () => {
  it("deducts expenses from the segment-aware accrual", () => {
    const periods = [
      { amount: 100, validFrom: new Date(2023, 5, 1) },
      { amount: 700, validFrom: new Date(2026, 0, 1) },
    ];

    expect(
      getRemainingRolloverBudget({
        currentDate: new Date(2026, 2, 15),
        rolloverDate: new Date(2023, 5, 1),
        budgetAmount: 700,
        totalExpensesSinceRollover: 1200,
        periods,
      })
    ).toBe(31 * 100 + 3 * 700 - 1200);
  });

  it("falls back to the flat amount when no schedule is passed", () => {
    expect(
      getRemainingRolloverBudget({
        currentDate: new Date(2023, 11, 10),
        rolloverDate: new Date(2023, 9, 10),
        budgetAmount: 100,
        totalExpensesSinceRollover: 50,
      })
    ).toBe(250);
  });
});
