// import React, { useState } from "react";
import React from "react";
import { useQuery } from "@apollo/client";
import { format } from "date-fns";
import { ExpensesList } from "../../components/expenses-list/expenses-list";
import { GET_EXPENSES_LIST } from "../../components/expenses-list/expenses-list-queries";
import { GET_CATEGORIES_LIST } from "../../components/categories-list/categories-list-queries";
import { ActionsBar } from "../../components/actions-bar/actions-bar";
import { getDecoratedCategoriesWithExpenses } from "../../utils/getDecoratedCategoriesWithExpenses";

export const ExpensesPageContainer = ({
  pageDate,
  onClickNext,
  onClickPrevious,
}: {
  pageDate: Date;
  onClickNext: () => void;
  onClickPrevious: () => void;
}) => {
  // const [showRolloverBudget, setShowRolloverBudget] = useState(true);

  const formattedDate = format(pageDate, "MM-dd-yyyy");

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
        // showRollover={showRolloverBudget}
        // toggleRollover={() => setShowRolloverBudget(!showRolloverBudget)}
      />
      <ExpensesList
        loading={loadingExpenses || loadingCategories}
        pageDate={pageDate}
        showRolloverBudget={false}
        // showRolloverBudget={showRolloverBudget}
        categoriesDecoratedWithExpenses={categoriesDecoratedWithExpenses}
        totalSubcategories={totalSubcategories}
        refetchExpenses={refetchExpenses}
      />
    </>
  );
};
