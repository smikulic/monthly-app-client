import { CategoryDecoratedWithExpenses } from "@/features/expenses/expenses-list/expenses-list";
import { Category, Expense, Subcategory } from "../generated/graphql";

export const getDecoratedCategoriesWithExpenses = ({
  categories,
  expenses,
}: {
  categories: Category[];
  expenses: Expense[];
}) => {
  let totalSubcategories = 0;

  if (!categories || !expenses) {
    return {
      totalSubcategories,
      categoriesDecoratedWithExpenses: [],
    };
  }

  const categoriesDecoratedWithExpenses: CategoryDecoratedWithExpenses[] =
    categories.map((category: Category) => {
      let totalExpenseAmount = 0;
      // Summed here rather than on the server, which exposes these per
      // subcategory only. `budgetForMonth`, never `budgetAmount`: the latter is
      // the amount in force *today*, so it would report the wrong figure for
      // any month the user navigates to.
      let totalBudgetForMonth = 0;
      let totalRolloverRemaining = 0;
      const subcategories = category.subcategories as Subcategory[];

      if (!subcategories) {
        return {
          ...category,
          subcategories: [],
          totalExpenseAmount,
          totalBudgetForMonth,
          totalRolloverRemaining,
        };
      }

      const subcategoriesDecoratedWithExpense = subcategories.map(
        (subcategory: Subcategory) => {
          totalSubcategories += 1;

          const foundExpenses = expenses.filter(
            (expense: Expense) => expense.subcategoryId === subcategory.id,
          );

          totalExpenseAmount = foundExpenses?.reduce(
            (accumulator: number, currentValue: Expense) =>
              accumulator + currentValue.amount,
            totalExpenseAmount,
          );

          totalBudgetForMonth += subcategory.budgetForMonth;
          totalRolloverRemaining += subcategory.rolloverRemaining;

          return {
            ...(subcategory as Subcategory),
            expenses: foundExpenses,
          };
        },
      );

      return {
        ...category,
        subcategories: subcategoriesDecoratedWithExpense,
        totalExpenseAmount,
        totalBudgetForMonth,
        totalRolloverRemaining,
      };
    });

  return {
    totalSubcategories,
    categoriesDecoratedWithExpenses,
  };
};
