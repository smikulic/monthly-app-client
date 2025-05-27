import { LineChart } from "@mui/x-charts/LineChart";
import { months } from "../../constants";
import { Box, Typography } from "@mui/material";
import { HomeChartTotalValueStyled } from "../home-page/home-page-style";
import {
  ErrorTextStyled,
  UnderlineTextStyled,
  WarningTextStyled,
} from "../../shared";
import { formatAmount } from "../../utils/format";
import { useContext } from "react";
import { UserContext } from "../../App";

export const ChartBudgetExpense = ({
  totalBudgetAmount,
  chartExpensesData,
  pageDate,
}: {
  totalBudgetAmount: number;
  chartExpensesData: number[];
  pageDate: Date;
}) => {
  const userCurrency = useContext(UserContext);
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
    </>
  );
};
