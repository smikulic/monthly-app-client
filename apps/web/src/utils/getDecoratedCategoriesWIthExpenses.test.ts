import { describe, expect, it } from "vitest";
import { Category, Expense } from "../generated/graphql";
import { getDecoratedCategoriesWithExpenses } from "./getDecoratedCategoriesWithExpenses";
import { categoryMock1, expenseMock1, expenseMock2 } from "./mockData";

describe("getDecoratedCategoriesWithExpenses", () => {
  let mockExpenses: Expense[] = [];
  let mockCategories: Category[] = [];

  it("should return zero totalSubcategories and empty array if categories and expenses are not provided", () => {
    const result = getDecoratedCategoriesWithExpenses({
      expenses: mockExpenses,
      categories: mockCategories,
    });

    expect(result).toEqual({
      totalSubcategories: 0,
      categoriesDecoratedWithExpenses: [],
    });
  });

  it("should correctly decorate categories without subcategories", () => {
    mockCategories = [categoryMock1];
    const result = getDecoratedCategoriesWithExpenses({
      categories: mockCategories,
      expenses: mockExpenses,
    });

    expect(result).toEqual({
      totalSubcategories: categoryMock1.subcategories.length,
      categoriesDecoratedWithExpenses: [
        {
          id: categoryMock1.id,
          name: categoryMock1.name,
          subcategories: [
            {
              ...categoryMock1.subcategories[0],
              expenses: [],
            },
            {
              ...categoryMock1.subcategories[1],
              expenses: [],
            },
          ],
          totalExpenseAmount: 0,
          totalBudgetForMonth: 300,
          totalRolloverRemaining: 300,
        },
      ],
    });
  });

  // The category row shows spent against budget, and neither figure exists on
  // the server — both are summed from the subcategories here.
  it("sums the subcategories' budget and rollover onto the category", () => {
    const result = getDecoratedCategoriesWithExpenses({
      categories: [categoryMock1],
      expenses: [],
    });
    const [category] = result.categoriesDecoratedWithExpenses;

    const expectedBudget = categoryMock1.subcategories.reduce(
      (total, sub) => total + sub.budgetForMonth,
      0,
    );
    const expectedRollover = categoryMock1.subcategories.reduce(
      (total, sub) => total + sub.rolloverRemaining,
      0,
    );

    expect(category.totalBudgetForMonth).toBe(expectedBudget);
    expect(category.totalRolloverRemaining).toBe(expectedRollover);
  });

  it("should correctly calculate totalExpenseAmount for categories with expenses", () => {
    mockCategories = [categoryMock1];
    mockExpenses = [expenseMock1, expenseMock2];
    const result = getDecoratedCategoriesWithExpenses({
      categories: mockCategories,
      expenses: mockExpenses,
    });

    expect(result.categoriesDecoratedWithExpenses[0].totalExpenseAmount).toBe(
      200,
    );
    expect(result.totalSubcategories).toBe(2);
  });
});
