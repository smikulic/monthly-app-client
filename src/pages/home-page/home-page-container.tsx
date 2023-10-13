import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import * as Sentry from "@sentry/react";
import { GET_CATEGORIES_LIST } from "../../components/categories-list/categories-list-queries";
import { LoadingScreen } from "../../components/loading-screen/loading-screen";
import { HomePage } from "../../components/home-page/home-page";
import {
  GET_CHART_EXPENSES_LIST,
  GET_EXPENSES_LIST,
} from "../../components/expenses-list/expenses-list-queries";
import { ActionsBar } from "../../components/actions-bar/actions-bar";
import { getChartData } from "../../utils/getChartData";

export const HomePageContainer = () => {
  const currentDate = new Date();
  const [pageDate, setPageDate] = useState(currentDate);

  const {
    data: expensesData,
    error: errorExpenses,
    loading: loadingExpenses,
  } = useQuery(GET_EXPENSES_LIST, { variables: { date: pageDate } });
  const {
    data: chartExpensesData,
    error: errorChartExpenses,
    loading: loadingChartExpenses,
  } = useQuery(GET_CHART_EXPENSES_LIST, { variables: { date: pageDate } });
  const {
    data: categoriesData,
    error: errorCategories,
    loading: loadingCategories,
  } = useQuery(GET_CATEGORIES_LIST);

  const { totalExpensesAmount, totalBudgetAmount } = getChartData({
    categories: categoriesData?.categories,
    expenses: expensesData?.expenses,
  });

  const noLoading =
    !loadingExpenses && !loadingChartExpenses && !loadingCategories;
  const noErrors = !errorExpenses && !errorChartExpenses && !errorCategories;

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
      />

      {/* Loading state */}
      {(loadingExpenses || loadingChartExpenses || loadingCategories) && (
        <LoadingScreen />
      )}

      {/* Error state */}
      {errorExpenses && <div>Error: {errorExpenses.message}</div>}
      {errorChartExpenses && <div>Error: {errorChartExpenses.message}</div>}
      {errorCategories && <div>Error: {errorCategories.message}</div>}

      {/* data not available state */}
      {noLoading && noErrors && !chartExpensesData.chartExpenses && (
        <HomePage
          totalExpensesAmount={0}
          totalBudgetAmount={0}
          chartExpensesData={new Array(12).fill(0)}
          pageDate={pageDate}
        />
      )}

      {/* data available state */}
      {noLoading && noErrors && chartExpensesData.chartExpenses && (
        <HomePage
          totalExpensesAmount={totalExpensesAmount}
          totalBudgetAmount={totalBudgetAmount}
          chartExpensesData={chartExpensesData.chartExpenses}
          pageDate={pageDate}
        />
      )}
    </Sentry.ErrorBoundary>
  );
};
