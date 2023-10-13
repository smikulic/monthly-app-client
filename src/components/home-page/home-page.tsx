import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";
import { formatAmount } from "../../utils/format";
import { months } from "../../constants";
import { HomeContainerStyled } from "./home-page-style";
import { MainListItemStyled } from "../../shared";
import { LoadingScreen } from "../loading-screen/loading-screen";

export const HomePage = ({
  totalExpensesAmount,
  totalBudgetAmount,
  chartExpensesData,
  loadingChartExpenses,
  pageDate,
}: {
  totalExpensesAmount: number;
  totalBudgetAmount: number;
  chartExpensesData: number[];
  loadingChartExpenses: boolean;
  pageDate: Date;
}) => {
  const selectedYear = pageDate.getFullYear();

  return (
    <HomeContainerStyled>
      <Box>
        <Link to="/app/expenses">
          <MainListItemStyled>
            Expenses
            <span className="red">{formatAmount(totalExpensesAmount)}</span>
          </MainListItemStyled>
        </Link>
        <Link to="/app/categories">
          <MainListItemStyled>
            Categories/Budget
            <span className="orange">{formatAmount(totalBudgetAmount)}</span>
          </MainListItemStyled>
        </Link>
      </Box>

      <br />

      <Box>
        {loadingChartExpenses && <LoadingScreen />}
        {!loadingChartExpenses && chartExpensesData && (
          <LineChart
            xAxis={[
              {
                id: "yearOverview",
                data: months,
                scaleType: "band",
                label: `${selectedYear}`,
              },
            ]}
            series={[
              {
                data: chartExpensesData,
                label: "Expenses",
                color: "#ff7777",
              },
              {
                data: new Array(12).fill(totalBudgetAmount),
                label: "Budget",
                color: "#eec22f",
              },
            ]}
            height={300}
          />
        )}
      </Box>
    </HomeContainerStyled>
  );
};
