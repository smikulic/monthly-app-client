import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import * as Sentry from "@sentry/react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { ExpensesList } from "../../components/expenses-list/expenses-list";
import { LoadingScreen } from "../../components/loading-screen/loading-screen";
import { GET_EXPENSES_LIST } from "../../components/expenses-list/expenses-list-queries";
import { GET_CATEGORIES_LIST } from "../../components/categories-list/categories-list-queries";
import { ActionsBar } from "../../components/actions-bar/actions-bar";
import { getDecoratedCategoriesWithExpenses } from "../../utils/getDecoratedCategoriesWithExpenses";

export const ExpensesPageContainer = () => {
  const currentDate = new Date();
  const [pageDate, setPageDate] = useState(currentDate);
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

  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      {/* Global state */}
      <ActionsBar
        displayDate={pageDate}
        onClickPrevious={() => {
          const previousDate = new Date(
            pageDate.getFullYear(),
            pageDate.getMonth() - 1,
            pageDate.getDate()
          );

          setPageDate(previousDate);
        }}
        onClickNext={() => {
          const nextDate = new Date(
            pageDate.getFullYear(),
            pageDate.getMonth() + 1,
            pageDate.getDate()
          );
          setPageDate(nextDate);
        }}
        showRollover={showRolloverBudget}
        toggleRollover={() => setShowRolloverBudget(!showRolloverBudget)}
      />

      {/* Loading state */}
      {(loadingExpenses || loadingCategories) && <LoadingScreen />}

      {/* Error state */}
      {errorExpenses && <div>Error: {errorExpenses.message}</div>}
      {errorCategories && <div>Error: {errorCategories.message}</div>}

      {/* Data not available state */}
      {noLoading &&
        noErrors &&
        (!categoriesDecoratedWithExpenses || totalSubcategories === 0) && (
          <>
            <Alert severity="info">
              <AlertTitle>
                Create a category and subcategory to enable adding an expense.
              </AlertTitle>
              <strong>Example:</strong> "Food" can be category, "Groceries" and
              "Restaurant" subcategories.
              <br />
              Or to keep it simple, just create a subcategory "all"
            </Alert>
          </>
        )}

      {/* data available state */}
      {noLoading &&
        noErrors &&
        categoriesDecoratedWithExpenses &&
        totalSubcategories > 0 && (
          <ExpensesList
            currentDate={currentDate}
            showRolloverBudget={showRolloverBudget}
            categoriesDecoratedWithExpenses={categoriesDecoratedWithExpenses}
            refetchExpenses={refetchExpenses}
          />
        )}
    </Sentry.ErrorBoundary>
  );
};
