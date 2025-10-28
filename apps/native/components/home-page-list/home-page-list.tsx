import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { HomeListItemLink } from "@/components/home-list-item-link/home-list-item-link";
import { ChartBudgetExpense } from "@/components/chart-budget-expense/chart-budget-expense";
import { ChartPie } from "@/components/chart-pie/chart-pie";

/**
 * Home Page List Component
 * Displays financial totals and charts
 * Matches web app's HomePageList structure
 */

type CategoryExpenseTotal = {
  categoryName: string;
  subcategoryName: string;
  total: number;
};

type HomePageListProps = {
  loading: boolean;
  totalExpensesAmount: number;
  totalBudgetAmount: number;
  totalSavingGoalsAmount: number;
  totalInvestmentsValue: number;
  chartExpensesData: number[];
  chartCategoriesData: CategoryExpenseTotal[];
  loadingChartExpenses: boolean;
  pageDate: Date;
};

export const HomePageList = ({
  loading,
  totalExpensesAmount,
  totalBudgetAmount,
  totalSavingGoalsAmount,
  totalInvestmentsValue,
  chartExpensesData,
  chartCategoriesData,
  loadingChartExpenses,
  pageDate,
}: HomePageListProps) => {
  // Tab state: 0 = Yearly expense, 1 = Expense by category
  const [tabIndex, setTabIndex] = useState(0);

  // TODO: Add navigation handlers for each link
  const handleExpensesPress = () => {
    console.log("Navigate to /expenses");
  };

  const handleBudgetPress = () => {
    console.log("Navigate to /budget");
  };

  const handleSavingGoalsPress = () => {
    console.log("Navigate to /saving-goals");
  };

  const handleInvestmentsPress = () => {
    console.log("Navigate to /investments");
  };

  return (
    <View style={styles.container}>
      {/* Financial totals list */}
      <View>
        <HomeListItemLink
          linkTo="/expenses"
          title="Expenses"
          loading={loading}
          value={totalExpensesAmount}
          valueColor="#ff7777"
          onPress={handleExpensesPress}
        />
        <HomeListItemLink
          linkTo="/budget"
          title="Budget"
          loading={loading}
          value={totalBudgetAmount}
          valueColor="#eec22f"
          onPress={handleBudgetPress}
        />
        <HomeListItemLink
          linkTo="/saving-goals"
          title="Saving Goals"
          loading={loading}
          value={totalSavingGoalsAmount}
          valueColor="#6a1fde"
          onPress={handleSavingGoalsPress}
        />
        <HomeListItemLink
          linkTo="/investments"
          title="Investments"
          loading={loading}
          value={totalInvestmentsValue}
          valueColor="#7fb77e"
          onPress={handleInvestmentsPress}
        />
      </View>

      {/* Charts section */}
      <View style={styles.chartsContainer}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, tabIndex === 0 && styles.tabActive]}
            onPress={() => setTabIndex(0)}
          >
            <Text
              style={[styles.tabText, tabIndex === 0 && styles.tabTextActive]}
            >
              Yearly expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tabIndex === 1 && styles.tabActive]}
            onPress={() => setTabIndex(1)}
          >
            <Text
              style={[styles.tabText, tabIndex === 1 && styles.tabTextActive]}
            >
              Expense by category
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chart content */}
        <View style={styles.chartContent}>
          {loadingChartExpenses ? (
            <Text style={styles.placeholderText}>Loading charts...</Text>
          ) : (
            <>
              {tabIndex === 0 && (
                <ChartBudgetExpense
                  totalBudgetAmount={totalBudgetAmount}
                  chartExpensesData={chartExpensesData}
                  pageDate={pageDate}
                />
              )}
              {tabIndex === 1 && chartCategoriesData.length > 0 && (
                <ChartPie data={chartCategoriesData} />
              )}
              {tabIndex === 1 && chartCategoriesData.length === 0 && (
                <View style={styles.chartPlaceholder}>
                  <Text style={styles.placeholderText}>
                    No category data available
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  chartsContainer: {
    marginHorizontal: 12,
    marginVertical: 6,
    paddingTop: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d6d7e0",
    overflow: "hidden",
  },

  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    minHeight: 32,
    justifyContent: "center",
  },

  tabActive: {
    backgroundColor: "#41efcd",
  },

  tabText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#181818",
  },

  tabTextActive: {
    color: "#181818",
    fontWeight: "400",
  },

  chartContent: {
    minHeight: 300,
  },

  chartPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },

  placeholderText: {
    fontSize: 16,
    color: "#878BAC",
    textAlign: "center",
  },
});
