import { SyntheticEvent, useState } from "react";
import { CategoryExpenseTotal } from "@/generated/graphql";
import { TabsStyled, TabStyled } from "@/shared";
import { HomeListItemLink } from "../home-list-item-link/home-list-item-link";
import { Typography } from "@/components/ui/Typography";
import { Box } from "@/components/ui/Box";
import { Skeleton } from "@/components/ui/Skeleton";
import { ChartBudgetExpense } from "../chart-budget-expense/chart-budget-expense";
import { ChartPie } from "../chart-pie/chart-pie";
import { HomeContainerStyled } from "./home-page-list-style";

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
}: {
  loading: boolean;
  totalExpensesAmount: number;
  totalBudgetAmount: number;
  totalSavingGoalsAmount: number;
  totalInvestmentsValue: number;
  chartExpensesData: number[];
  chartCategoriesData: CategoryExpenseTotal[];
  loadingChartExpenses: boolean;
  pageDate: Date;
}) => {
  // Tab state: 0 = Budget vs Expenses, 1 = Categories
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_: SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  return (
    <HomeContainerStyled>
      <Box>
        <HomeListItemLink
          linkTo="/expenses"
          title="Expenses"
          loading={loading}
          value={totalExpensesAmount}
          valueColor="#ff7777"
        />
        <HomeListItemLink
          linkTo="/budget"
          title="Budget"
          loading={loading}
          value={totalBudgetAmount}
          valueColor="#eec22f"
        />
        <HomeListItemLink
          linkTo="/saving-goals"
          title="Saving Goals"
          loading={loading}
          value={totalSavingGoalsAmount}
          valueColor="#6a1fde"
        />
        <HomeListItemLink
          linkTo="/investments"
          title="Investments"
          loading={loading}
          value={totalInvestmentsValue}
          valueColor="#7fb77e"
        />
      </Box>

      <Box
        sx={{
          margin: "2px 12px",
          paddingTop: "12px",
          border: "1px solid #d6d7e0",
          borderRadius: "16px",
        }}
      >
        <TabsStyled
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="Home page charts"
        >
          <TabStyled label="Yearly expense" />
          <TabStyled label="Expense by category" />
        </TabsStyled>

        <Box sx={{ padding: 1 }}>
          {loadingChartExpenses && <Skeleton animation="wave" height={300} />}
          {!loadingChartExpenses &&
            (() => {
              // Check if we have valid chart data
              const hasValidExpenseData =
                Array.isArray(chartExpensesData) &&
                chartExpensesData.length === 12;
              const hasValidCategoriesData = Array.isArray(chartCategoriesData);
              const hasValidBudget =
                typeof totalBudgetAmount === "number" &&
                !isNaN(totalBudgetAmount);
              const hasValidData =
                hasValidExpenseData && hasValidCategoriesData && hasValidBudget;

              if (!hasValidData) {
                return (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="subtitle1" color="textSecondary">
                      No chart data to display.
                    </Typography>
                  </Box>
                );
              }

              // Render the appropriate chart based on selected tab
              if (tabIndex === 0) {
                return (
                  <ChartBudgetExpense
                    totalBudgetAmount={totalBudgetAmount}
                    chartExpensesData={chartExpensesData}
                    pageDate={pageDate}
                  />
                );
              }

              if (tabIndex === 1 && chartCategoriesData.length > 0) {
                return <ChartPie data={chartCategoriesData} />;
              }

              return null;
            })()}
        </Box>
        {/* <ChartTreemap data={chartCategoriesData} /> */}
      </Box>
    </HomeContainerStyled>
  );
};
