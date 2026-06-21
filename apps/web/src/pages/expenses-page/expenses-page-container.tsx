import { useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { getDecoratedCategoriesWithExpenses } from "@/utils/getDecoratedCategoriesWithExpenses";
import { ExpensesList } from "@/features/expenses";
import { GET_EXPENSES_LIST } from "@/pages/expenses-page/expenses-page-queries";
import { GET_CATEGORIES_LIST } from "@/pages/categories-page/categories-page-queries";
import { ActionsBar } from "@/components/layout";
import { useScope, scopeVariables } from "@/features/groups/scope-context";
import { ScopeFilter } from "@/features/groups/scope-filter";
import { useExpensesActions } from "./use-expenses-actions-hook";

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

  const scope = useScope();
  const formattedDate = dayjs(pageDate).format("MM-DD-YYYY");

  const {
    data: expensesData,
    loading: loadingExpenses,
    refetch: refetchExpenses,
  } = useQuery(GET_EXPENSES_LIST, {
    variables: {
      date: formattedDate,
      ...scopeVariables(scope),
    },
  });

  const { data: categoriesData, loading: loadingCategories } = useQuery(
    GET_CATEGORIES_LIST,
    {
      variables: scopeVariables(scope),
    },
  );

  const {
    openCategory,
    createModalExpense,
    updateModalExpense,
    setOpenCategory,
    setCreateModalExpense,
    setUpdateModalExpense,
  } = useExpensesActions();

  const { totalSubcategories, categoriesDecoratedWithExpenses } =
    getDecoratedCategoriesWithExpenses({
      categories: categoriesData?.categories,
      expenses: expensesData?.expenses,
    });

  return (
    <>
      <ScopeFilter />
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
        showRolloverBudget={showRolloverBudget}
        categoriesDecoratedWithExpenses={categoriesDecoratedWithExpenses}
        totalSubcategories={totalSubcategories}
        openCategory={openCategory}
        createModalExpense={createModalExpense}
        updateModalExpense={updateModalExpense}
        onSetOpenCategory={setOpenCategory}
        onSetCreateModalExpense={setCreateModalExpense}
        onSetUpdateModalExpense={setUpdateModalExpense}
        refetchExpenses={refetchExpenses}
      />
    </>
  );
};
