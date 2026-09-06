import { useCallback, useState } from "react";
import { useApolloClient, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { getDecoratedCategoriesWithExpenses } from "@/utils/getDecoratedCategoriesWithExpenses";
import { ExpensesList } from "@/features/expenses";
import { GET_EXPENSES_LIST } from "@/pages/expenses-page/expenses-page-queries";
import { GET_CATEGORIES_LIST } from "@/pages/categories-page/categories-page-queries";
import { ActionsBar } from "@/components/layout";
import { useScope, scopeVariables } from "@/features/groups/scope-context";
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

  const { data: expensesData, loading: loadingExpenses } = useQuery(
    GET_EXPENSES_LIST,
    {
      variables: {
        date: formattedDate,
        ...scopeVariables(scope),
      },
    },
  );

  /*
   * Two queries read expenses on this page and both go stale on a write:
   * `ExpensesList` is the viewed month, and `Expenses` is every expense ever,
   * which each subcategory row uses to work out what the rollover has already
   * been spent against. Refetching only the first left the rollover figure
   * showing pre-edit numbers until a hard refresh.
   */
  const refetchExpenses = useCallback(
    () => client.refetchQueries({ include: ["ExpensesList", "Expenses"] }),
    [client],
  );

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
      <ActionsBar
        showScope
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
