import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts/LineChart";
import { formatAmount } from "../../utils/format";

const HomeContainerStyled = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",

  "& a": {
    textDecoration: "none",
    color: "inherit",
  },
});

export const HomePage = ({
  totalExpensesAmount,
  totalBudgetAmount,
  chartExpensesData,
  pageDate,
}: {
  totalExpensesAmount: number;
  totalBudgetAmount: number;
  chartExpensesData: number[];
  pageDate: Date;
}) => {
  const selectedYear = pageDate.getFullYear();

  return (
    <HomeContainerStyled>
      <Box>
        <Link to="/app/expenses">
          <div className="listItem">
            Expenses
            <span className="red">{formatAmount(totalExpensesAmount)}</span>
          </div>
        </Link>
        <Link to="/app/categories">
          <div className="listItem">
            Categories/Budget
            <span className="orange">{formatAmount(totalBudgetAmount)}</span>
          </div>
        </Link>
      </Box>

      <br />

      <Box>
        <LineChart
          xAxis={[
            {
              id: "yearOverview",
              data: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
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
      </Box>
    </HomeContainerStyled>
  );
};
