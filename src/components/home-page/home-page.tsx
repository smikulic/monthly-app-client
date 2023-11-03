import React from "react";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";
import { Skeleton, Typography } from "@mui/material";
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
        <Box sx={{ padding: "16px 0 0 20px" }}>
          <Typography
            variant="body1"
            fontSize="18px"
            color="primary.contrastText"
          >
            {selectedYear} Overview
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
