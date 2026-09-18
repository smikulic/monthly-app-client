import { useCallback, useState } from "react";
import { useApolloClient, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { getDecoratedCategoriesWithExpenses } from "@/utils/getDecoratedCategoriesWithExpenses";
import { ExpensesList } from "@/features/expenses";
import { GET_EXPENSES_LIST } from "@/pages/expenses-page/expenses-page-queries";
import { GET_CATEGORIES_LIST } from "@/pages/categories-page/categories-page-queries";
import { ActionsBar } from "@/components/layout";
import { RefreshingStyled } from "@/shared";
import { useScope, scopeVariables } from "@/features/groups/scope-context";
import { invalidateBudgetFigures } from "@/utils/invalidateBudgetFigures";
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

  const client = useApolloClient();

  const {
    data: expensesDataCurrent,
    previousData: expensesDataPrevious,
    loading: loadingExpenses,
  } = useQuery(GET_EXPENSES_LIST, {
    variables: {
      date: formattedDate,
      ...scopeVariables(scope),
    },
  });

  // Fall back to the last month's result while the new one is in flight, so
  // the list keeps its height instead of collapsing to skeletons and back.
  const expensesData = expensesDataCurrent ?? expensesDataPrevious;

  /*
   * The rollover figure comes back on the categories query now, so a write has
   * to refresh that as well as the expense list. The eviction covers the months
   * that are cached but not on screen: rollover is cumulative, so an expense
   * recorded here also moves every month after it.
   */
  const refetchExpenses = useCallback(() => {
    invalidateBudgetFigures(client);
    return client.refetchQueries({
      include: ["ExpensesList", "CategoriesList"],
    });
  }, [client]);

  const {
    data: categoriesDataCurrent,
    previousData: categoriesDataPrevious,
    loading: loadingCategories,
  } = useQuery(GET_CATEGORIES_LIST, {
    variables: { date: formattedDate, ...scopeVariables(scope) },
  });

  const categoriesData = categoriesDataCurrent ?? categoriesDataPrevious;

  const isRefetching =
    (loadingExpenses || loadingCategories) && Boolean(expensesData);
  // Skeletons are for the genuine first load only — when there is nothing to
  // hold on screen yet.
  const isFirstLoad = (loadingExpenses || loadingCategories) && !expensesData;

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
      <ActionsBar
        showScope
        pageDate={pageDate}
        onClickNext={onClickNext}
        onClickPrevious={onClickPrevious}
        showRollover={showRolloverBudget}
        toggleRollover={() => setShowRolloverBudget(!showRolloverBudget)}
      />
      <RefreshingStyled refreshing={isRefetching}>
        <ExpensesList
          loading={isFirstLoad}
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
      </RefreshingStyled>
    </>
  );
};
