import { SyntheticEvent, useState } from "react";
import { HomeContainerStyled } from "./home-page-style";
import { HomeListItemLink } from "../home-list-item-link/home-list-item-link";
import { TabsStyled, TabStyled } from "../../shared";
import { ChartBudgetExpense } from "../chart-budget-expense/chart-budget-expense";
import { CategoryExpenseTotal } from "../../generated/graphql";
import { ChartPie } from "../chart-pie/chart-pie";
import { Typography } from "@/components/ui/Typography";
import { Box } from "@/components/ui/Box";
import { Skeleton } from "@/components/ui/Skeleton";

export const HomePage = ({
  loading,
  totalExpensesAmount,
  totalBudgetAmount,
  totalSavingGoalsAmount,
  chartExpensesData,
  chartCategoriesData,
  loadingChartExpenses,
  pageDate,
}: {
  loading: boolean;
  totalExpensesAmount: number;
  totalBudgetAmount: number;
  totalSavingGoalsAmount: number;
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
            chartExpensesData &&
            chartCategoriesData && (
              <>
                {tabIndex === 0 && (
                  <ChartBudgetExpense
                    totalBudgetAmount={totalBudgetAmount}
                    chartExpensesData={chartExpensesData}
                    pageDate={pageDate}
                  />
                )}
                {tabIndex === 1 && <ChartPie data={chartCategoriesData} />}
              </>
            )}
          {!loadingChartExpenses &&
            chartExpensesData.length === 0 &&
            chartCategoriesData.length === 0 && (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="subtitle1" color="textSecondary">
                  No chart data to display.
                </Typography>
              </Box>
            )}
        </Box>
        {/* <ChartTreemap data={chartCategoriesData} /> */}
      </Box>
    </HomeContainerStyled>
  );
};
