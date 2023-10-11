import { getRolloverBudget } from "./getRolloverBudget";

describe("getRolloverBudget", () => {
  const budgetAmount = 100;
  const budgetCreated = "1696953636180"; // Oct 10th, 2023, 18h (CEST)

  describe("when we are still in a current month", () => {
    const currentDate = new Date(
      "Wed Oct 10 2023 10:00:00 GMT+0200 (Central European Summer Time)"
    );
    const rolloverBudget = getRolloverBudget({
      currentDate,
      createdAt: budgetCreated,
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
      createdAt: budgetCreated,
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
      createdAt: budgetCreated,
      budgetAmount,
    });

    it("returns 13x the value of defined budget", () => {
      expect(rolloverBudget).toBe(budgetAmount * 13);
    });
  });
});
