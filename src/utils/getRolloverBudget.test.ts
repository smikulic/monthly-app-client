import {
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
