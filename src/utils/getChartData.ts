import { Category, Expense, Subcategory } from "../generated/graphql";

export const getChartData = ({
  expenses,
  categories,
}: {
  expenses: Expense[];
  categories: Category[];
}) => {
  if (!expenses || !categories) {
    return {
      totalExpensesAmount: 0,
      totalBudgetAmount: 0,
    };
  }

  const totalExpensesAmount = expenses.reduce(
    (accumulator: number, currentValue: Expense) =>
      accumulator + currentValue.amount,
    0
  );

  const totalBudgetAmount = categories
    .map((category: Category) => {
      const subcategories = category.subcategories as Subcategory[];

      if (!subcategories) {
        return 0;
      }

      const totalSubcategoryExpenses = subcategories.reduce(
        (accumulator: number, currentValue: Subcategory) =>
          accumulator + (currentValue.budgetAmount || 0),
        0
      );

      return totalSubcategoryExpenses;
    })
    .reduce(
      (accumulator: number, currentValue: number) => accumulator + currentValue,
      0
    );

  return {
    totalExpensesAmount,
    totalBudgetAmount,
  };
};
