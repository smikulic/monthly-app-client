import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { ExpensesList } from "../../components/expenses-list/expenses-list";
import { GET_EXPENSES_LIST } from "../../components/expenses-list/expenses-list-queries";
import { GET_CATEGORIES_LIST } from "../../components/categories-list/categories-list-queries";
import { ActionsBar } from "../../components/actions-bar/actions-bar";
import { getDecoratedCategoriesWithExpenses } from "../../utils/getDecoratedCategoriesWithExpenses";
import { PageContainer } from "../../components/page-container/page-container";

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

  const {
    data: expensesData,
    error: errorExpenses,
    loading: loadingExpenses,
    refetch: refetchExpenses,
  } = useQuery(GET_EXPENSES_LIST, {
    variables: {
      date: pageDate,
    },
  });
  const {
    data: categoriesData,
    error: errorCategories,
    loading: loadingCategories,
  } = useQuery(GET_CATEGORIES_LIST);

  const { totalSubcategories, categoriesDecoratedWithExpenses } =
    getDecoratedCategoriesWithExpenses({
      categories: categoriesData?.categories,
      expenses: expensesData?.expenses,
    });

  const noLoading = !loadingExpenses && !loadingCategories;
  const noErrors = !errorExpenses && !errorCategories;
  const noDataAvailable =
    noLoading &&
    noErrors &&
    (!categoriesDecoratedWithExpenses || totalSubcategories === 0);

  return (
    <PageContainer
      loading={loadingExpenses || loadingCategories}
      noData={noDataAvailable}
      actionsBarComponent={
        <ActionsBar
          pageDate={pageDate}
          onClickNext={onClickNext}
          onClickPrevious={onClickPrevious}
          showRollover={showRolloverBudget}
          toggleRollover={() => setShowRolloverBudget(!showRolloverBudget)}
        />
      }
      dataAvailableComponent={
        <ExpensesList
          pageDate={pageDate}
          showRolloverBudget={showRolloverBudget}
          categoriesDecoratedWithExpenses={categoriesDecoratedWithExpenses}
          refetchExpenses={refetchExpenses}
        />
      }
      noDataAvailableComponent={
        <Alert severity="info">
          <AlertTitle>
            Create a category and subcategory to enable adding an expense.
          </AlertTitle>
          <strong>Example:</strong> "Food" can be category, "Groceries" and
          "Restaurant" subcategories.
          <br />
          Or to keep it simple, just create a subcategory "all"
        </Alert>
      }
    />
  );
};
