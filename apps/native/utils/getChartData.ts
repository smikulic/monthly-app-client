/**
 * Calculate total expenses and budget amounts
 * Used by home page to display totals
 */

type Expense = {
  id: string;
  amount: number;
  subcategoryId: string;
  description?: string;
  date: string;
};

type Subcategory = {
  id: string;
  name: string;
  budgetAmount: number;
  categoryId: string;
};

type Category = {
  id: string;
  name: string;
  subcategories?: Subcategory[];
};

export const getChartData = ({
  expenses,
  categories,
}: {
  expenses?: Expense[];
  categories?: Category[];
}) => {
  if (!expenses || !categories) {
    return {
      totalExpensesAmount: 0,
      totalBudgetAmount: 0,
    };
  }

  // Calculate total expenses
  const totalExpensesAmount = expenses.reduce(
    (accumulator: number, currentValue: Expense) =>
      accumulator + currentValue.amount,
    0
  );

  // Calculate total budget from all subcategories
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
