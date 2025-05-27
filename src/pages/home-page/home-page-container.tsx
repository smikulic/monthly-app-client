import React from "react";
import { useQuery } from "@apollo/client";
import * as Sentry from "@sentry/react";
import { format } from "date-fns";
import { GET_CATEGORIES_LIST } from "../../components/categories-list/categories-list-queries";
import { HomePage } from "../../components/home-page/home-page";
import {
  GET_CHART_EXPENSES_LIST,
  GET_EXPENSES_LIST,
} from "../../components/expenses-list/expenses-list-queries";
import { ActionsBar } from "../../components/actions-bar/actions-bar";
import { getChartData } from "../../utils/getChartData";
import { GET_SAVING_GOALS_LIST } from "../../components/saving-goals-list/saving-goals-list-queries";
import { SavingGoal } from "../../generated/graphql";

export const HomePageContainer = ({
  pageDate,
  onClickNext,
  onClickPrevious,
}: {
  pageDate: Date;
  onClickNext: () => void;
  onClickPrevious: () => void;
}) => {
  const formattedDate = format(pageDate, "MM-dd-yyyy");

  const { data: expensesData, loading: loadingExpenses } = useQuery(
    GET_EXPENSES_LIST,
    { variables: { date: formattedDate } }
  );
  const { data: chartExpensesData, loading: loadingChartExpenses } = useQuery(
    GET_CHART_EXPENSES_LIST,
    {
      variables: { date: formattedDate },
    }
  );
  const { data: categoriesData, loading: loadingCategories } =
    useQuery(GET_CATEGORIES_LIST);
  const { data: savingGoalsData, loading: loadingSavingGoals } = useQuery(
    GET_SAVING_GOALS_LIST
  );

  const { totalExpensesAmount, totalBudgetAmount } = getChartData({
    categories: categoriesData?.categories,
    expenses: expensesData?.expenses,
  });

  const totalSavingGoalsAmount = savingGoalsData?.savingGoals.reduce(
    (accumulator: number, currentGoal: SavingGoal) => {
      return accumulator + currentGoal.goalAmount;
    },
    0
  );

  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <ActionsBar
        pageDate={pageDate}
        onClickNext={onClickNext}
        onClickPrevious={onClickPrevious}
      />
      <HomePage
        loading={loadingExpenses || loadingCategories || loadingSavingGoals}
        totalExpensesAmount={totalExpensesAmount}
        totalBudgetAmount={totalBudgetAmount}
        totalSavingGoalsAmount={totalSavingGoalsAmount}
        chartExpensesData={chartExpensesData?.chartExpenses?.monthlyTotals}
        chartCategoriesData={
          chartExpensesData?.chartExpenses?.categoryExpenseTotals
        }
        loadingChartExpenses={loadingChartExpenses}
        pageDate={pageDate}
      />
    </Sentry.ErrorBoundary>
  );
};
