import { useContext, useMemo, useState, useEffect } from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";

// charts
import { LineChart } from "echarts/charts";

// components
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";

// renderer
import { CanvasRenderer } from "echarts/renderers";

import { useTheme } from "@/hooks/useTheme";
import { UserContext } from "@/App";
import { months } from "@/constants";
import { formatAmount } from "@/utils/format";
import {
  ErrorTextStyled,
  UnderlineTextStyled,
  WarningTextStyled,
} from "@/shared";
import { HomeChartTotalValueStyled } from "@/components/home-page-list/home-page-list-style";
import { Typography } from "@/components/ui/Typography";
import { Box } from "@/components/ui/Box";

// register only what we need
echarts.use([
  LineChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer,
]);

export const ChartBudgetExpense = ({
  totalBudgetAmount,
  chartExpensesData,
  pageDate,
}: {
  totalBudgetAmount: number;
  chartExpensesData: number[];
  pageDate: Date;
}) => {
  try {
    // Immediate safety check - bail out completely if data is invalid
    if (
      !Array.isArray(chartExpensesData) ||
      chartExpensesData.length !== 12 ||
      typeof totalBudgetAmount !== "number" ||
      isNaN(totalBudgetAmount) ||
      chartExpensesData.some((val) => typeof val !== "number" || isNaN(val))
    ) {
      return (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="subtitle1" color="textSecondary">
            Chart data is loading...
          </Typography>
        </Box>
      );
    }

    // Create absolutely safe data arrays
    const safeExpensesData = chartExpensesData.map((val) =>
      typeof val === "number" && !isNaN(val) ? val : 0
    );
    const safeBudgetAmount =
      typeof totalBudgetAmount === "number" && !isNaN(totalBudgetAmount)
        ? totalBudgetAmount
        : 0;

    // State to control when ECharts should render
    const [chartReady, setChartReady] = useState(false);

    // Only set chart ready when data is absolutely valid
    useEffect(() => {
      // Extra strict validation
      const isValidExpensesData =
        Array.isArray(safeExpensesData) &&
        safeExpensesData.length === 12 &&
        safeExpensesData.every(
          (val) => typeof val === "number" && !isNaN(val) && isFinite(val)
        );

      const isValidBudgetAmount =
        typeof safeBudgetAmount === "number" &&
        !isNaN(safeBudgetAmount) &&
        isFinite(safeBudgetAmount);

      const isValidMonthsData = Array.isArray(months) && months.length === 12;

      console.log("Chart validation:", {
        isValidExpensesData,
        isValidBudgetAmount,
        isValidMonthsData,
        safeExpensesData,
        safeBudgetAmount,
      });

      if (isValidExpensesData && isValidBudgetAmount && isValidMonthsData) {
        // Add small delay to ensure all data is stable
        const timer = setTimeout(() => {
          console.log("Setting chart ready to true");
          setChartReady(true);
        }, 200);
        return () => clearTimeout(timer);
      } else {
        console.log("Chart not ready, keeping false");
        setChartReady(false);
      }
    }, [safeExpensesData, safeBudgetAmount]);

    const theme = useTheme();
    const userCurrency = useContext(UserContext);
    const selectedYear = pageDate.getFullYear();

    // Totals & formatting
    const totalExpensePerYear = safeExpensesData.reduce((sum, v) => sum + v, 0);
    const totalBudgetPerYear = safeBudgetAmount * 12;
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
          formatter: ({
            0: a,
            1: b,
          }: {
            0: { seriesName: string; data: number };
            1: { seriesName: string; data: number };
          }) =>
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
            data: safeExpensesData,
            smooth: true,
            areaStyle: {},
            itemStyle: { color: "#ff7777" },
          },
          {
            name: "Budget",
            type: "line",
            data: new Array(12).fill(safeBudgetAmount),
            smooth: true,
            showSymbol: false,
            itemStyle: { color: "#eec22f" },
          },
        ],
      }),
      [safeExpensesData, safeBudgetAmount, userCurrency, theme]
    );

    return (
      <>
        <Box sx={{ p: 2 }}>
          <Typography
            variant="body1"
            fontSize="16px"
            color="primary.contrastText"
            component="div"
          >
            <HomeChartTotalValueStyled>
              <div>
                Total {selectedYear} expenses are{" "}
                <UnderlineTextStyled>{formattedExpense}</UnderlineTextStyled>{" "}
                and total budget is{" "}
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

        {chartReady ? (
          <ReactEChartsCore
            echarts={echarts}
            option={option}
            style={{ width: "100%", height: 300 }}
            opts={{ renderer: "canvas" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="subtitle1" color="textSecondary">
              Preparing chart...
            </Typography>
          </div>
        )}
      </>
    );
  } catch (error) {
    console.error("ChartBudgetExpense error:", error);
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="subtitle1" color="error">
          Chart could not be displayed
        </Typography>
      </Box>
    );
  }
};
