import React from "react";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";
import { Skeleton, Typography } from "@mui/material";
import { months } from "../../constants";
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

export const HomePage = ({
  loading,
  totalExpensesAmount,
  totalBudgetAmount,
  totalSavingGoalsAmount,
  chartExpensesData,
  loadingChartExpenses,
  pageDate,
}: {
  loading: boolean;
  totalExpensesAmount: number;
  totalBudgetAmount: number;
  totalSavingGoalsAmount: number;
  chartExpensesData: number[];
  loadingChartExpenses: boolean;
  pageDate: Date;
}) => {
  const userCurrency = React.useContext(UserContext);
  const selectedYear = pageDate.getFullYear();
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
        <Box sx={{ padding: "16px 20px 0 20px" }}>
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
        {loadingChartExpenses && <Skeleton animation="wave" height={300} />}
        {!loadingChartExpenses && chartExpensesData && (
          <LineChart
            yAxis={[{ id: "budgetOverview" }]}
            xAxis={[
              {
                id: "yearOverview",
                data: months,
                scaleType: "band",
                label: `${selectedYear}`,
              },
            ]}
            leftAxis={{
              axisId: "budgetOverview",
              disableLine: true,
              disableTicks: true,
              tickFontSize: 10,
            }}
            bottomAxis={{
              axisId: "yearOverview",
              disableLine: true,
              disableTicks: true,
              tickFontSize: 10,
            }}
            series={[
              {
                data: chartExpensesData,
                area: true,
                label: "Expenses",
                color: "#ff7777",
              },
              {
                data: new Array(12).fill(totalBudgetAmount),
                label: "Budget",
                color: "#eec22f",
                showMark: false,
              },
            ]}
            height={300}
          />
        )}
      </Box>
    </HomeContainerStyled>
  );
};
