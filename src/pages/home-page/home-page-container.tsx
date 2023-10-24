import React from "react";
import { useQuery } from "@apollo/client";
import * as Sentry from "@sentry/react";
import { GET_CATEGORIES_LIST } from "../../components/categories-list/categories-list-queries";
import { HomePage } from "../../components/home-page/home-page";
import {
  GET_CHART_EXPENSES_LIST,
  GET_EXPENSES_LIST,
} from "../../components/expenses-list/expenses-list-queries";
import { ActionsBar } from "../../components/actions-bar/actions-bar";
import { getChartData } from "../../utils/getChartData";

export const HomePageContainer = ({
  pageDate,
  onClickNext,
  onClickPrevious,
}: {
  pageDate: Date;
  onClickNext: () => void;
  onClickPrevious: () => void;
}) => {
  const { data: expensesData, loading: loadingExpenses } = useQuery(
    GET_EXPENSES_LIST,
    { variables: { date: pageDate } }
  );
  const { data: chartExpensesData, loading: loadingChartExpenses } = useQuery(
    GET_CHART_EXPENSES_LIST,
    {
      variables: { date: pageDate },
    }
  );
  const { data: categoriesData, loading: loadingCategories } =
    useQuery(GET_CATEGORIES_LIST);

  const { totalExpensesAmount, totalBudgetAmount } = getChartData({
    categories: categoriesData?.categories,
    expenses: expensesData?.expenses,
  });

  // TODO: Replace this with actual data from API
  const totalSavingGoalsAmount = 0;

  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <ActionsBar
        pageDate={pageDate}
        onClickNext={onClickNext}
        onClickPrevious={onClickPrevious}
      />
      <HomePage
        loading={loadingExpenses || loadingCategories}
        totalExpensesAmount={totalExpensesAmount}
        totalBudgetAmount={totalBudgetAmount}
        totalSavingGoalsAmount={totalSavingGoalsAmount}
        chartExpensesData={chartExpensesData?.chartExpenses}
        loadingChartExpenses={loadingChartExpenses}
        pageDate={pageDate}
      />
    </Sentry.ErrorBoundary>
  );
};
