import React from "react";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";
import { Skeleton } from "@mui/material";
import { months } from "../../constants";
import { HomeContainerStyled } from "./home-page-style";
import { HomeListItemLink } from "../home-list-item-link/home-list-item-link";

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
  const selectedYear = pageDate.getFullYear();

  return (
    <HomeContainerStyled>
      <Box>
        <HomeListItemLink
          linkTo="/expenses"
          title="Expenses"
          loading={loading}
          value={totalExpensesAmount}
          valueColor="red"
        />
        <HomeListItemLink
          linkTo="/categories"
          title="Categories/Budget"
          loading={loading}
          value={totalBudgetAmount}
          valueColor="orange"
        />
        <HomeListItemLink
          linkTo="/saving-goals"
          title="Saving Goals"
          loading={loading}
          value={totalSavingGoalsAmount}
        />
      </Box>

      <Box sx={{ padding: "8px" }}>
        {loadingChartExpenses && <Skeleton animation="wave" height={300} />}
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
