import { useQuery } from "@apollo/client";
import * as Sentry from "@sentry/react";
import dayjs from "dayjs";
import { SavingGoal, Investment } from "@/generated/graphql";
import {
  GET_CHART_EXPENSES_LIST,
  GET_EXPENSES_LIST,
} from "@/components/expenses-list/expenses-list-queries";
import { GET_CATEGORIES_LIST } from "@/components/categories-list/categories-list-queries";
import { getChartData } from "@/utils/getChartData";
import { HomePage } from "@/components/home-page/home-page";
import { ActionsBar } from "@/components/actions-bar/actions-bar";
import { GET_SAVING_GOALS_LIST } from "@/components/saving-goals-list/saving-goals-list-queries";
import { GET_INVESTMENTS_LIST } from "@/components/investments-list/investments-list-queries";

export const HomePageContainer = ({
  pageDate,
  onClickNext,
  onClickPrevious,
}: {
  pageDate: Date;
  onClickNext: () => void;
  onClickPrevious: () => void;
}) => {
  const formattedDate = dayjs(pageDate).format("MM-DD-YYYY");

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
  const { data: investmentsData, loading: loadingInvestments } =
    useQuery(GET_INVESTMENTS_LIST);

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

  const totalInvestmentsValue =
    investmentsData?.investments.reduce(
      (accumulator: number, currentInvestment: Investment) => {
        return (
          accumulator +
          (currentInvestment.amount || currentInvestment.initialAmount)
        );
      },
      0
    ) || 0;

  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <ActionsBar
        pageDate={pageDate}
        onClickNext={onClickNext}
        onClickPrevious={onClickPrevious}
      />
      <HomePage
        loading={
          loadingExpenses ||
          loadingCategories ||
          loadingSavingGoals ||
          loadingInvestments
        }
        totalExpensesAmount={totalExpensesAmount}
        totalBudgetAmount={totalBudgetAmount}
        totalSavingGoalsAmount={totalSavingGoalsAmount}
        totalInvestmentsValue={totalInvestmentsValue}
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
