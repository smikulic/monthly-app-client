import React from "react";
import { Link } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";
import { Skeleton } from "@mui/material";
import { formatAmount } from "../../utils/format";
import { months } from "../../constants";
import { HomeContainerStyled } from "./home-page-style";
import { MainListItemStyled } from "../../shared";

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
        <Link to="/app/expenses">
          <MainListItemStyled>
            {loading ? (
              <>
                <Skeleton animation="wave" width={200} height={20} />
                <span className="red">
                  <Skeleton animation="wave" width={60} height={20} />
                </span>
              </>
            ) : (
              <>
                <Box sx={{ display: "flex" }}>
                  Expenses <ChevronRightIcon />
                </Box>
                <span className="red">{formatAmount(totalExpensesAmount)}</span>
              </>
            )}
          </MainListItemStyled>
        </Link>
        <Link to="/app/categories">
          <MainListItemStyled>
            {loading ? (
              <>
                <Skeleton animation="wave" width={200} height={20} />
                <span className="orange">
                  <Skeleton animation="wave" width={60} height={20} />
                </span>
              </>
            ) : (
              <>
                <Box sx={{ display: "flex" }}>
                  Categories/Budget <ChevronRightIcon />
                </Box>
                <span className="orange">
                  {formatAmount(totalBudgetAmount)}
                </span>
              </>
            )}
          </MainListItemStyled>
        </Link>
        <Link to="/app/saving-goals">
          <MainListItemStyled>
            {loading ? (
              <>
                <Skeleton animation="wave" width={200} height={20} />
                <span>
                  <Skeleton animation="wave" width={60} height={20} />
                </span>
              </>
            ) : (
              <>
                <Box sx={{ display: "flex" }}>
                  Saving Goals <ChevronRightIcon />
                </Box>
                <span>{formatAmount(totalSavingGoalsAmount)}</span>
              </>
            )}
          </MainListItemStyled>
        </Link>
      </Box>

      <br />

      <Box sx={{ padding: "20px" }}>
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
