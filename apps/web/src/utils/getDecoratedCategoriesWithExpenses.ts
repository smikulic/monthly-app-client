import { CategoryDecoratedWithExpenses } from "../components/expenses-list/expenses-list";
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
      const subcategories = category.subcategories as Subcategory[];

      if (!subcategories) {
        return {
          ...category,
          subcategories: [],
          totalExpenseAmount,
        };
      }

      const subcategoriesDecoratedWithExpense = subcategories.map(
        (subcategory: Subcategory) => {
          totalSubcategories += 1;

          const foundExpenses = expenses.filter(
            (expense: Expense) => expense.subcategoryId === subcategory.id
          );

          totalExpenseAmount = foundExpenses?.reduce(
            (accumulator: number, currentValue: Expense) =>
              accumulator + currentValue.amount,
            totalExpenseAmount
          );

          return {
            ...(subcategory as Subcategory),
            expenses: foundExpenses,
          };
        }
      );

      return {
        ...category,
        subcategories: subcategoriesDecoratedWithExpense,
        totalExpenseAmount,
      };
    });

  return {
    totalSubcategories,
    categoriesDecoratedWithExpenses,
  };
};
