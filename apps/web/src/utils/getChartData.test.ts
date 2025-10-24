import { describe, expect, it } from "vitest";
import { Category, Expense } from "../generated/graphql";
import { getChartData } from "./getChartData";
import { categoryMock1, expenseMock1, expenseMock2 } from "./mockData";

describe("getChartData", () => {
  let mockExpenses: Expense[] = [];
  let mockCategories: Category[] = [];

  it("should return zeros if expenses and categories are not provided", () => {
    const result = getChartData({
      expenses: mockExpenses,
      categories: mockCategories,
    });

    expect(result).toEqual({
      totalExpensesAmount: 0,
      totalBudgetAmount: 0,
    });
  });

  it("should correctly calculate totalExpensesAmount", () => {
    mockExpenses = [expenseMock1, expenseMock2];
    const result = getChartData({
      expenses: mockExpenses,
      categories: mockCategories,
    });

    expect(result.totalExpensesAmount).toBe(200);
  });

  it("should correctly calculate totalBudgetAmount with nested subcategories", () => {
    mockCategories = [
      categoryMock1,
      {
        id: "categoryId2",
        name: "TestCategory2",
        subcategories: [
          {
            id: "subCategoryId3",
            categoryId: "categoryId2",
            name: "TestSubcategory3",
            createdAt: "",
            rolloverDate: "",
            budgetAmount: 300,
          },
        ],
      },
    ];
    const result = getChartData({
      expenses: mockExpenses,
      categories: mockCategories,
    });

    expect(result.totalBudgetAmount).toBe(600);
  });

  it("should handle categories without subcategories", () => {
    const mockCategories = [categoryMock1];
    const result = getChartData({
      expenses: mockExpenses,
      categories: mockCategories,
    });

    expect(result.totalBudgetAmount).toBe(300);
  });
});
