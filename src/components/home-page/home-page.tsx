import React from "react";
import Box from "@mui/material/Box";
import { Skeleton, Typography, Tabs, Tab } from "@mui/material";
import {
  HomeContainerStyled,
  HomeChartTotalValueStyled,
} from "./home-page-style";
import { HomeListItemLink } from "../home-list-item-link/home-list-item-link";
import { UserContext } from "../../App";
import { formatAmount } from "../../utils/format";
import {
  ErrorTextStyled,
  WarningTextStyled,
  UnderlineTextStyled,
} from "../../shared";
import { ChartBudgetExpense } from "../chart-budget-expense/chart-budget-expense";
import { CategoryExpenseTotal } from "../../generated/graphql";
import { ChartPie } from "../chart-pie/chart-pie";

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
  const userCurrency = React.useContext(UserContext);
  const selectedYear = pageDate.getFullYear();

  // Tab state: 0 = Budget vs Expenses, 1 = Categories
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  const totalExpensePerYear =
    chartExpensesData?.reduce((acc, curr) => curr + acc) || 0;
  const totalBudgetAmountPerYear = totalBudgetAmount * 12;
  const formattedTotalExpensePerYear = formatAmount(
    totalExpensePerYear,
    userCurrency
  );
  const formattedTotalBudgetPerYear = formatAmount(
    totalBudgetAmountPerYear,
    userCurrency
  );
  const budgetExpenseDiff = totalBudgetAmountPerYear - totalExpensePerYear;
  const spentOver = totalExpensePerYear > totalBudgetAmountPerYear;
  const formattedBudgetExpenseDiff = formatAmount(
    Math.abs(budgetExpenseDiff),
    userCurrency
  );

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
          border: "1px solid #d6d7e0",
          borderRadius: "16px",
        }}
      >
        {loadingChartExpenses && <Skeleton animation="wave" height={300} />}
        {!loadingChartExpenses && chartExpensesData && chartCategoriesData && (
          <>
            <Box sx={{ padding: "16px 20px 16px 20px" }}>
              <Typography
                variant="body1"
                fontSize="16px"
                color="primary.contrastText"
              >
                <HomeChartTotalValueStyled>
                  <div>
                    Total {selectedYear} expenses are{" "}
                    <UnderlineTextStyled>
                      {formattedTotalExpensePerYear}
                    </UnderlineTextStyled>{" "}
                    and total budget is{" "}
                    <UnderlineTextStyled>
                      {formattedTotalBudgetPerYear}
                    </UnderlineTextStyled>{" "}
                    so you spent{" "}
                    <UnderlineTextStyled>
                      {spentOver ? (
                        <ErrorTextStyled>
                          {formattedBudgetExpenseDiff}
                        </ErrorTextStyled>
                      ) : (
                        <WarningTextStyled>
                          {formattedBudgetExpenseDiff}
                        </WarningTextStyled>
                      )}{" "}
                    </UnderlineTextStyled>
                    {spentOver ? "over" : "under"} budget.
                  </div>
                </HomeChartTotalValueStyled>
              </Typography>
            </Box>

            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="Budget vs Expenses" />
              <Tab label="Categories" />
            </Tabs>

            <Box sx={{ padding: 2 }}>
              {tabIndex === 0 && (
                <ChartBudgetExpense
                  totalBudgetAmount={totalBudgetAmount}
                  chartExpensesData={chartExpensesData}
                  pageDate={pageDate}
                />
              )}
              {tabIndex === 1 && chartCategoriesData.length > 0 ? (
                <ChartPie data={chartCategoriesData} />
              ) : (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="subtitle1" color="textSecondary">
                    No categories to display.
                  </Typography>
                </Box>
              )}
            </Box>
            {/* <ChartCategories data={chartCategoriesData} /> */}
            {/* <ChartTreemap data={chartCategoriesData} /> */}
          </>
        )}
      </Box>
    </HomeContainerStyled>
  );
};
