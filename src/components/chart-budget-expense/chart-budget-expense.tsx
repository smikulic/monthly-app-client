import { useContext, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@mui/material";
import { months } from "@/constants";
import { formatAmount } from "@/utils/format";
import {
  ErrorTextStyled,
  UnderlineTextStyled,
  WarningTextStyled,
} from "@/shared";
import { HomeChartTotalValueStyled } from "@/components/home-page/home-page-style";
import { Typography } from "@/components/ui/Typography";
import { Box } from "@/components/ui/Box";
import { UserContext } from "@/App";

export const ChartBudgetExpense = ({
  totalBudgetAmount,
  chartExpensesData,
  pageDate,
}: {
  totalBudgetAmount: number;
  chartExpensesData: number[];
  pageDate: Date;
}) => {
  const theme = useTheme();
  const userCurrency = useContext(UserContext);
  const selectedYear = pageDate.getFullYear();

  // Totals & formatting
  const totalExpensePerYear =
    chartExpensesData.reduce((sum, v) => sum + v, 0) || 0;
  const totalBudgetPerYear = totalBudgetAmount * 12;
  const formattedExpense = formatAmount(totalExpensePerYear, userCurrency);
  const formattedBudget = formatAmount(totalBudgetPerYear, userCurrency);
  const diff = totalBudgetPerYear - totalExpensePerYear;
  const spentOver = totalExpensePerYear > totalBudgetPerYear;
  const formattedDiff = formatAmount(Math.abs(diff), userCurrency);

  // ECharts option
  const option = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
        formatter: ({ 0: a, 1: b }: any) =>
          `${a.seriesName}: ${formatAmount(a.data, userCurrency)}<br/>` +
          `${b.seriesName}: ${formatAmount(b.data, userCurrency)}`,
        textStyle: { fontSize: 12 },
        axisPointer: { type: "line" },
      },
      legend: {
        data: ["Expenses", "Budget"],
        top: 0,
        textStyle: { fontSize: 12 },
      },
      grid: { top: 30, left: 40, right: 20, bottom: 30 },
      xAxis: {
        type: "category",
        data: months,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 10 },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 10 },
        splitLine: { lineStyle: { color: theme.palette.divider } },
      },
      series: [
        {
          name: "Expenses",
          type: "line",
          data: chartExpensesData,
          smooth: true,
          areaStyle: {},
          itemStyle: { color: "#ff7777" },
        },
        {
          name: "Budget",
          type: "line",
          data: new Array(12).fill(totalBudgetAmount),
          smooth: true,
          showSymbol: false,
          itemStyle: { color: "#eec22f" },
        },
      ],
    }),
    [chartExpensesData, totalBudgetAmount, userCurrency, theme]
  );

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="body1"
          fontSize="16px"
          color="primary.contrastText"
        >
          <HomeChartTotalValueStyled>
            <div>
              Total {selectedYear} expenses are{" "}
              <UnderlineTextStyled>{formattedExpense}</UnderlineTextStyled> and
              total budget is{" "}
              <UnderlineTextStyled>{formattedBudget}</UnderlineTextStyled> so
              you spent{" "}
              <UnderlineTextStyled>
                {spentOver ? (
                  <ErrorTextStyled>{formattedDiff}</ErrorTextStyled>
                ) : (
                  <WarningTextStyled>{formattedDiff}</WarningTextStyled>
                )}{" "}
              </UnderlineTextStyled>
              {spentOver ? "over" : "under"} budget.
            </div>
          </HomeChartTotalValueStyled>
        </Typography>
      </Box>

      <ReactECharts
        option={option}
        style={{ width: "100%", height: 300 }}
        opts={{ renderer: "canvas" }}
      />
    </>
  );
};
