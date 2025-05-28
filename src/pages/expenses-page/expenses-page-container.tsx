import { useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { getDecoratedCategoriesWithExpenses } from "@/utils/getDecoratedCategoriesWithExpenses";
import { ExpensesList } from "@/components/expenses-list/expenses-list";
import { GET_EXPENSES_LIST } from "@/components/expenses-list/expenses-list-queries";
import { GET_CATEGORIES_LIST } from "@/components/categories-list/categories-list-queries";
import { ActionsBar } from "@/components/actions-bar/actions-bar";

export const ExpensesPageContainer = ({
  pageDate,
  onClickNext,
  onClickPrevious,
}: {
  pageDate: Date;
  onClickNext: () => void;
  onClickPrevious: () => void;
}) => {
  const [showRolloverBudget, setShowRolloverBudget] = useState(true);

  const formattedDate = dayjs(pageDate).format("MM-DD-YYYY");

  const {
    data: expensesData,
    loading: loadingExpenses,
    refetch: refetchExpenses,
  } = useQuery(GET_EXPENSES_LIST, {
    variables: {
      date: formattedDate,
    },
  });
  const { data: categoriesData, loading: loadingCategories } =
    useQuery(GET_CATEGORIES_LIST);

  const { totalSubcategories, categoriesDecoratedWithExpenses } =
    getDecoratedCategoriesWithExpenses({
      categories: categoriesData?.categories,
      expenses: expensesData?.expenses,
    });

  return (
    <>
      <ActionsBar
        pageDate={pageDate}
        onClickNext={onClickNext}
        onClickPrevious={onClickPrevious}
        showRollover={showRolloverBudget}
        toggleRollover={() => setShowRolloverBudget(!showRolloverBudget)}
      />
      <ExpensesList
        loading={loadingExpenses || loadingCategories}
        pageDate={pageDate}
        // showRolloverBudget={false}
        showRolloverBudget={showRolloverBudget}
        categoriesDecoratedWithExpenses={categoriesDecoratedWithExpenses}
        totalSubcategories={totalSubcategories}
        refetchExpenses={refetchExpenses}
      />
    </>
  );
};
