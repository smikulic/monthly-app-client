import { useContext } from "react";
import { useQuery } from "@apollo/client";
import * as Sentry from "@sentry/react";
import dayjs from "dayjs";
import { SavingGoal, Investment } from "@/generated/graphql";
import { UserContext } from "@/App";
import { formatAmount } from "@/utils/format";
import { GET_EXPENSES_LIST } from "@/pages/expenses-page/expenses-page-queries";
import { GET_CATEGORIES_LIST } from "@/pages/categories-page/categories-page-queries";
import { GET_INSIGHTS } from "@/pages/insights-page/insights-page-queries";
import { getChartData } from "@/utils/getChartData";
import { HomePageList } from "@/components/home-page-list/home-page-list";
import { ActionsBar } from "@/components/layout";
import { GET_SAVING_GOALS_LIST } from "@/pages/saving-goals-page/saving-goals-page-queries";
import { GET_INVESTMENTS_LIST } from "@/pages/investments-page/investments-page-queries";
import { useScope, scopeVariables } from "@/features/groups/scope-context";

export const HomePageContainer = ({
  pageDate,
  onClickNext,
  onClickPrevious,
}: {
  pageDate: Date;
  onClickNext: () => void;
  onClickPrevious: () => void;
}) => {
  const scope = useScope();
  const userCurrency = useContext(UserContext);
  const formattedDate = dayjs(pageDate).format("MM-DD-YYYY");

  const { data: expensesData, loading: loadingExpenses } = useQuery(
    GET_EXPENSES_LIST,
    { variables: { date: formattedDate, ...scopeVariables(scope) } },
  );
  const { data: categoriesData, loading: loadingCategories } = useQuery(
    GET_CATEGORIES_LIST,
    { variables: scopeVariables(scope) },
  );
  const { data: savingGoalsData, loading: loadingSavingGoals } = useQuery(
    GET_SAVING_GOALS_LIST,
  );
  const { data: investmentsData, loading: loadingInvestments } =
    useQuery(GET_INVESTMENTS_LIST);

  // Shares the cache with the Insights page (same query + variables).
  const { data: insightsData } = useQuery(GET_INSIGHTS, {
    variables: { date: formattedDate, ...scopeVariables(scope) },
    fetchPolicy: "cache-and-network",
  });

  const { totalExpensesAmount, totalBudgetAmount } = getChartData({
    categories: categoriesData?.categories,
    expenses: expensesData?.expenses,
  });

  // Live summary line for the Insights card.
  const ins = insightsData?.insights;
  const fmt = (n: number) => formatAmount(n, userCurrency);
  let insightsSummary: string | undefined;
  if (ins) {
    if (ins.totalBudget > 0) {
      insightsSummary =
        ins.totalSafeToSpend >= 0
          ? `Safe to spend: ${fmt(ins.totalSafeToSpend)} · projected ${fmt(ins.totalProjected)}`
          : `Over budget by ${fmt(-ins.totalSafeToSpend)} · projected ${fmt(ins.totalProjected)}`;
    } else {
      insightsSummary = `${fmt(ins.totalSpent)} spent this month`;
    }
  }

  const totalSavingGoalsAmount = savingGoalsData?.savingGoals.reduce(
    (accumulator: number, currentGoal: SavingGoal) => {
      return accumulator + currentGoal.goalAmount;
    },
    0,
  );

  const totalInvestmentsValue =
    investmentsData?.investments.reduce(
      (accumulator: number, currentInvestment: Investment) => {
        return (
          accumulator +
          (currentInvestment.amount || currentInvestment.initialAmount)
        );
      },
      0,
    ) || 0;

  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <ActionsBar
        showScope
        pageDate={pageDate}
        onClickNext={onClickNext}
        onClickPrevious={onClickPrevious}
      />
      <HomePageList
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
        insightsSummary={insightsSummary}
      />
    </Sentry.ErrorBoundary>
  );
};
