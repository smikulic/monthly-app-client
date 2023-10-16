import React from "react";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES_LIST } from "../../components/categories-list/categories-list-queries";
import { HomePage } from "../../components/home-page/home-page";
import {
  GET_CHART_EXPENSES_LIST,
  GET_EXPENSES_LIST,
} from "../../components/expenses-list/expenses-list-queries";
import { ActionsBar } from "../../components/actions-bar/actions-bar";
import { getChartData } from "../../utils/getChartData";
import { PageContainer } from "../../components/page-container/page-container";

export const HomePageContainer = ({
  pageDate,
  onClickNext,
  onClickPrevious,
}: {
  pageDate: Date;
  onClickNext: () => void;
  onClickPrevious: () => void;
}) => {
  const {
    data: expensesData,
    error: errorExpenses,
    loading: loadingExpenses,
  } = useQuery(GET_EXPENSES_LIST, { variables: { date: pageDate } });
  const {
    data: chartExpensesData,
    error: errorChartExpenses,
    loading: loadingChartExpenses,
  } = useQuery(GET_CHART_EXPENSES_LIST, {
    variables: { date: pageDate },
  });
  const {
    data: categoriesData,
    error: errorCategories,
    loading: loadingCategories,
  } = useQuery(GET_CATEGORIES_LIST);

  const { totalExpensesAmount, totalBudgetAmount } = getChartData({
    categories: categoriesData?.categories,
    expenses: expensesData?.expenses,
  });

  const noLoading = !loadingExpenses && !loadingCategories;
  const noErrors = !errorExpenses && !errorChartExpenses && !errorCategories;
  const noDataAvailable =
    noLoading && noErrors && !chartExpensesData?.chartExpenses;

  return (
    <PageContainer
      loading={loadingExpenses || loadingCategories}
      noData={noDataAvailable}
      actionsBarComponent={
        <ActionsBar
          pageDate={pageDate}
          onClickNext={onClickNext}
          onClickPrevious={onClickPrevious}
        />
      }
      dataAvailableComponent={
        <HomePage
          totalExpensesAmount={totalExpensesAmount}
          totalBudgetAmount={totalBudgetAmount}
          chartExpensesData={chartExpensesData?.chartExpenses}
          loadingChartExpenses={loadingChartExpenses}
          pageDate={pageDate}
        />
      }
      noDataAvailableComponent={
        <HomePage
          totalExpensesAmount={0}
          totalBudgetAmount={0}
          chartExpensesData={new Array(12).fill(0)}
          loadingChartExpenses={loadingChartExpenses}
          pageDate={pageDate}
        />
      }
    />
  );
};
