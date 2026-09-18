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
import { RefreshingStyled } from "@/shared";
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

  // `previousData` keeps last month's figures on screen while the next month
  // loads. Without it, changing month blanks every card to a skeleton and back,
  // which reads as a flicker rather than a navigation.
  const {
    data: expensesCurrent,
    previousData: expensesPrevious,
    loading: loadingExpenses,
  } = useQuery(GET_EXPENSES_LIST, {
    variables: { date: formattedDate, ...scopeVariables(scope) },
  });
  const expensesData = expensesCurrent ?? expensesPrevious;

  const {
    data: categoriesCurrent,
    previousData: categoriesPrevious,
    loading: loadingCategories,
  } = useQuery(GET_CATEGORIES_LIST, {
    variables: { date: formattedDate, ...scopeVariables(scope) },
  });
  const categoriesData = categoriesCurrent ?? categoriesPrevious;
  const { data: savingGoalsData, loading: loadingSavingGoals } = useQuery(
    GET_SAVING_GOALS_LIST,
  );
  const { data: investmentsData, loading: loadingInvestments } =
    useQuery(GET_INVESTMENTS_LIST);

  // Shares the cache with the Insights page (same query + variables).
  const { data: insightsCurrent, previousData: insightsPrevious } = useQuery(
    GET_INSIGHTS,
    {
      variables: { date: formattedDate, ...scopeVariables(scope) },
      fetchPolicy: "cache-and-network",
    },
  );
  const insightsData = insightsCurrent ?? insightsPrevious;

  const { totalExpensesAmount, totalBudgetAmount } = getChartData({
    categories: categoriesData?.categories,
    expenses: expensesData?.expenses,
  });

  // Live summary line for the Insights card.
  const ins = insightsData?.insights;
  const fmt = (n: number) => formatAmount(n, userCurrency);
  // The figure and its context are passed separately rather than pre-joined
  // into a sentence, so Insights renders as a hero number like every other row
  // instead of being the one card without one.
  let insightsValue: number | string = "Spending pace, trends & streaks";
  let insightsCaption: string | undefined;
  let insightsTone: "neutral" | "negative" = "neutral";
  if (ins) {
    if (ins.totalBudget > 0) {
      const over = ins.totalSafeToSpend < 0;
      insightsValue = Math.abs(ins.totalSafeToSpend);
      insightsCaption = over
        ? `over budget · projected ${fmt(ins.totalProjected)}`
        : `safe to spend · projected ${fmt(ins.totalProjected)}`;
      // The only figure on the dashboard that earns a colour.
      insightsTone = over ? "negative" : "neutral";
    } else {
      insightsValue = ins.totalSpent;
      insightsCaption = "spent this month";
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

  const anyLoading =
    loadingExpenses ||
    loadingCategories ||
    loadingSavingGoals ||
    loadingInvestments;
  // Skeletons belong to the genuine first load. Once there is a month on
  // screen, a refetch dims it rather than blanking it.
  const hasSomethingToShow = Boolean(expensesData && categoriesData);

  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <ActionsBar
        showScope
        pageDate={pageDate}
        onClickNext={onClickNext}
        onClickPrevious={onClickPrevious}
      />
      <RefreshingStyled refreshing={anyLoading && hasSomethingToShow}>
        <HomePageList
          loading={anyLoading && !hasSomethingToShow}
          totalExpensesAmount={totalExpensesAmount}
          totalBudgetAmount={totalBudgetAmount}
          totalSavingGoalsAmount={totalSavingGoalsAmount}
          totalInvestmentsValue={totalInvestmentsValue}
          insightsValue={insightsValue}
          insightsCaption={insightsCaption}
          insightsTone={insightsTone}
        />
      </RefreshingStyled>
    </Sentry.ErrorBoundary>
  );
};
