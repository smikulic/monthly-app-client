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
import { getPersonColors } from "@/utils/personColors";
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

const isTwelveNumbers = (values: unknown): values is number[] =>
  Array.isArray(values) &&
  values.length === 12 &&
  values.every((v) => typeof v === "number" && !isNaN(v));

export interface SharedUserSeries {
  userId: string;
  name: string;
  monthlyTotals: number[];
  total: number;
}

export const ChartBudgetExpense = ({
  monthlyBudgets,
  chartExpensesData,
  sharedByUser = [],
  pageDate,
}: {
  /** Budget in force in each month, so a mid-year change draws as a step. */
  monthlyBudgets: number[];
  chartExpensesData: number[];
  /** Shared-category spend per person. Empty when nothing is shared. */
  sharedByUser?: SharedUserSeries[];
  pageDate: Date;
}) => {
  try {
    // Immediate safety check - bail out completely if data is invalid
    if (!isTwelveNumbers(chartExpensesData) || !isTwelveNumbers(monthlyBudgets)) {
      return (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="subtitle1" color="textSecondary">
            Chart data is loading...
          </Typography>
        </Box>
      );
    }

    // Both arrays are already validated as twelve finite numbers above.
    const safeExpensesData = chartExpensesData;
    const safeBudgetsData = monthlyBudgets;

    // State to control when ECharts should render
    const [chartReady, setChartReady] = useState(false);

    // Only set chart ready when data is absolutely valid
    useEffect(() => {
      const isValidMonthsData = Array.isArray(months) && months.length === 12;
      const allFinite = [...safeExpensesData, ...safeBudgetsData].every(
        (val) => isFinite(val),
      );

      if (allFinite && isValidMonthsData) {
        // Add small delay to ensure all data is stable
        const timer = setTimeout(() => {
          setChartReady(true);
        }, 200);
        return () => clearTimeout(timer);
      } else {
        console.log("Chart not ready, keeping false");
        setChartReady(false);
      }
    }, [safeExpensesData, safeBudgetsData]);

    const theme = useTheme();
    const userCurrency = useContext(UserContext);
    const selectedYear = pageDate.getFullYear();
    const personColors = useMemo(
      () => getPersonColors(sharedByUser.map((u) => u.userId), theme.palette),
      [sharedByUser, theme.palette],
    );

    // Totals & formatting
    const totalExpensePerYear = safeExpensesData.reduce((sum, v) => sum + v, 0);
    // Summed, not one month multiplied by twelve: the budget can change during
    // the year, and a year before it opened should total zero rather than
    // twelve months of today's figure.
    const totalBudgetPerYear = safeBudgetsData.reduce((sum, v) => sum + v, 0);
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
          // Written over all series rather than a fixed pair: the number of
          // lines depends on how many people share categories.
          formatter: (params: { seriesName: string; data: number }[]) =>
            params
              .map(
                (p) =>
                  `${p.seriesName}: ${formatAmount(p.data, userCurrency)}`,
              )
              .join("<br/>"),
          textStyle: { fontSize: 12 },
          axisPointer: { type: "line" },
        },
        legend: {
          data: ["Expenses", "Budget", ...sharedByUser.map((u) => u.name)],
          top: 0,
          textStyle: { fontSize: 12 },
          type: "scroll",
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
            data: safeBudgetsData,
            // Not smoothed: a budget holds flat within a month and jumps at the
            // boundary, so a rounded curve would imply a gradual change.
            smooth: false,
            step: "middle",
            showSymbol: false,
            itemStyle: { color: "#eec22f" },
          },
          /*
           * One thin line per person, covering shared categories only. Kept
           * subordinate to the two totals: these answer "who paid" and sit
           * below the Expenses line by definition, since shared spend is a
           * subset of it.
           */
          ...sharedByUser.map((u) => ({
            name: u.name,
            type: "line",
            data: u.monthlyTotals,
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 1.5, type: "dashed" },
            itemStyle: { color: personColors[u.userId] },
          })),
        ],
      }),
      [safeExpensesData, safeBudgetsData, sharedByUser, personColors, userCurrency, theme],
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
