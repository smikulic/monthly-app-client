import { useQuery } from "@apollo/client";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  GET_CHART_EXPENSES_LIST,
  GET_EXPENSES_LIST,
} from "@/pages/expenses-page/expenses-page-queries";
import { GET_CATEGORIES_LIST } from "@/pages/categories-page/categories-page-queries";
import { GET_SAVING_GOALS_LIST } from "@/pages/saving-goals-page/saving-goals-page-queries";
import { GET_INVESTMENTS_LIST } from "@/pages/investments-page/investments-page-queries";
import { getChartData } from "@/utils/getChartData";
import { ActionsBar } from "@/components/layout";
import { HomePageList } from "@/components/home-page-list/home-page-list";

/**
 * Home Page Container
 * Fetches all data and displays dashboard
 * Feature parity with web app
 */

type HomePageContainerProps = {
  pageDate: Date;
  onClickNext: () => void;
  onClickPrevious: () => void;
};

export const HomePageContainer = ({
  pageDate,
  onClickNext,
  onClickPrevious,
}: HomePageContainerProps) => {
  // Format date for GraphQL query (MM-DD-YYYY)
  const formattedDate = `${String(pageDate.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(pageDate.getDate()).padStart(2, "0")}-${pageDate.getFullYear()}`;

  // Fetch expenses for current month
  const { data: expensesData, loading: loadingExpenses } = useQuery(
    GET_EXPENSES_LIST,
    { variables: { date: formattedDate } }
  );

  // Fetch chart data (monthly totals and category breakdown)
  const { data: chartExpensesData, loading: loadingChartExpenses } = useQuery(
    GET_CHART_EXPENSES_LIST,
    { variables: { date: formattedDate } }
  );

  // Fetch categories (for budget total)
  const { data: categoriesData, loading: loadingCategories } =
    useQuery(GET_CATEGORIES_LIST);

  // Fetch saving goals
  const { data: savingGoalsData, loading: loadingSavingGoals } = useQuery(
    GET_SAVING_GOALS_LIST
  );

  // Fetch investments
  const { data: investmentsData, loading: loadingInvestments } =
    useQuery(GET_INVESTMENTS_LIST);

  // Calculate totals
  const { totalExpensesAmount, totalBudgetAmount } = getChartData({
    categories: categoriesData?.categories,
    expenses: expensesData?.expenses,
  });

  // Calculate saving goals total
  const totalSavingGoalsAmount =
    savingGoalsData?.savingGoals.reduce(
      (accumulator: number, currentGoal: any) => {
        return accumulator + currentGoal.goalAmount;
      },
      0
    ) || 0;

  // Calculate investments total
  const totalInvestmentsValue =
    investmentsData?.investments.reduce(
      (accumulator: number, currentInvestment: any) => {
        return (
          accumulator +
          (currentInvestment.amount || currentInvestment.initialAmount)
        );
      },
      0
    ) || 0;

  const isLoading =
    loadingExpenses ||
    loadingCategories ||
    loadingSavingGoals ||
    loadingInvestments;

  return (
    <View style={styles.container}>
      {/* Month Navigation */}
      <ActionsBar
        pageDate={pageDate}
        onClickNext={onClickNext}
        onClickPrevious={onClickPrevious}
      />

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollView}>
        <HomePageList
          loading={isLoading}
          totalExpensesAmount={totalExpensesAmount}
          totalBudgetAmount={totalBudgetAmount}
          totalSavingGoalsAmount={totalSavingGoalsAmount}
          totalInvestmentsValue={totalInvestmentsValue}
          chartExpensesData={
            chartExpensesData?.chartExpenses?.monthlyTotals || []
          }
          chartCategoriesData={
            chartExpensesData?.chartExpenses?.categoryExpenseTotals || []
          }
          loadingChartExpenses={loadingChartExpenses}
          pageDate={pageDate}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
});
