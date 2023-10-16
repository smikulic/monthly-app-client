import { Category, Expense } from "../generated/graphql";

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

  const totalBudgetAmount = categories.reduce((acc, category) => {
    const subcategoryTotal = (category.subcategories || []).reduce(
      (subAcc, subcategory) => subAcc + (subcategory?.budgetAmount || 0),
      0
    );
    return acc + subcategoryTotal;
  }, 0);

  return {
    totalExpensesAmount,
    totalBudgetAmount,
  };
};
