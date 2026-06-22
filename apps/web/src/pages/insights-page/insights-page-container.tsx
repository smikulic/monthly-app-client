import { useContext, useState, SyntheticEvent } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { UserContext } from "@/App";
import { formatAmount } from "@/utils/format";
import { ActionsBar } from "@/components/layout";
import { TabsStyled, TabStyled } from "@/shared";
import { Box } from "@/components/ui/Box";
import { Skeleton } from "@/components/ui/Skeleton";
import { ChartBudgetExpense } from "@/components/chart-budget-expense/chart-budget-expense";
import { ChartPie } from "@/components/chart-pie/chart-pie";
import { useScope, scopeVariables } from "@/features/groups/scope-context";
import { GET_CHART_EXPENSES_LIST } from "@/pages/expenses-page/expenses-page-queries";
import { GET_INSIGHTS } from "./insights-page-queries";
import {
  InsightsWrapperStyled,
  SectionStyled,
  SectionTitleStyled,
  HeroAmountStyled,
  SubtleTextStyled,
  RowStyled,
  RowMainStyled,
  RowTitleStyled,
  RowRightStyled,
  BarTrackStyled,
  DeltaStyled,
  StreakBadgeStyled,
  EmptyTextStyled,
} from "./insights-page-style";

const TEAL = "#3bceb1";
const RED = "#ff7777";

interface Props {
  pageDate: Date;
  onClickNext: () => void;
  onClickPrevious: () => void;
}

export const InsightsPageContainer = ({
  pageDate,
  onClickNext,
  onClickPrevious,
}: Props) => {
  const userCurrency = useContext(UserContext);
  const scope = useScope();
  const formattedDate = dayjs(pageDate).format("MM-DD-YYYY");

  const { data, loading } = useQuery(GET_INSIGHTS, {
    variables: { date: formattedDate, ...scopeVariables(scope) },
    fetchPolicy: "cache-and-network",
  });

  const { data: chartData, loading: loadingChart } = useQuery(
    GET_CHART_EXPENSES_LIST,
    {
      variables: { date: formattedDate, ...scopeVariables(scope) },
      fetchPolicy: "cache-and-network",
    },
  );

  const insights = data?.insights;
  const fmt = (n: number) => formatAmount(n, userCurrency);

  const chartExpensesData: number[] =
    chartData?.chartExpenses?.monthlyTotals || [];
  const chartCategoriesData =
    chartData?.chartExpenses?.categoryExpenseTotals || [];
  const budgetForChart = insights?.totalBudget ?? 0;
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (_: SyntheticEvent, next: number) =>
    setTabIndex(next);

  const renderDelta = (delta: number, percent?: number | null) => {
    const up = delta > 0;
    return (
      <DeltaStyled up={up}>
        {up ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
        {fmt(Math.abs(delta))}
        {percent != null && (
          <span>&nbsp;({Math.abs(Math.round(percent))}%)</span>
        )}
      </DeltaStyled>
    );
  };

  return (
    <>
      <ActionsBar
        showScope
        pageDate={pageDate}
        onClickNext={onClickNext}
        onClickPrevious={onClickPrevious}
      />

      <InsightsWrapperStyled>
        {/* Overview charts */}
        <Box
          sx={{
            paddingTop: "12px",
            border: "1px solid #d6d7e0",
            borderRadius: "12px",
          }}
        >
          <TabsStyled
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="Insights charts"
          >
            <TabStyled label="Yearly expense" />
            <TabStyled label="Expense by category" />
          </TabsStyled>

          <Box sx={{ padding: 1 }}>
            {loadingChart && <Skeleton animation="wave" height={300} />}
            {!loadingChart &&
              (() => {
                const hasValidExpenseData =
                  Array.isArray(chartExpensesData) &&
                  chartExpensesData.length === 12;
                const hasValidCategoriesData =
                  Array.isArray(chartCategoriesData);

                if (!hasValidExpenseData || !hasValidCategoriesData) {
                  return (
                    <Box sx={{ p: 4, textAlign: "center" }}>
                      <EmptyTextStyled>
                        No chart data to display.
                      </EmptyTextStyled>
                    </Box>
                  );
                }

                if (tabIndex === 0) {
                  return (
                    <ChartBudgetExpense
                      totalBudgetAmount={budgetForChart}
                      chartExpensesData={chartExpensesData}
                      pageDate={pageDate}
                    />
                  );
                }

                if (tabIndex === 1 && chartCategoriesData.length > 0) {
                  return <ChartPie data={chartCategoriesData} />;
                }

                return null;
              })()}
          </Box>
        </Box>

        {!insights && loading && (
          <EmptyTextStyled>Loading insights...</EmptyTextStyled>
        )}

        {insights && (
          <>
            {/* Safe to spend / pace */}
            <SectionStyled>
              <SectionTitleStyled>Safe to spend</SectionTitleStyled>
              <HeroAmountStyled negative={insights.totalSafeToSpend < 0}>
                {fmt(insights.totalSafeToSpend)}
              </HeroAmountStyled>
              <SubtleTextStyled>
                {fmt(insights.totalSpent)} spent of {fmt(insights.totalBudget)}{" "}
                budget &middot; day {insights.daysElapsed} of{" "}
                {insights.daysInMonth}
              </SubtleTextStyled>
              <SubtleTextStyled style={{ marginTop: 6 }}>
                Projected month end:{" "}
                <span
                  style={{
                    color:
                      insights.totalProjected > insights.totalBudget
                        ? RED
                        : TEAL,
                    fontWeight: 600,
                  }}
                >
                  {fmt(insights.totalProjected)}
                </span>
                {insights.totalProjected > insights.totalBudget &&
                  insights.totalBudget > 0 &&
                  ` (over by ${fmt(insights.totalProjected - insights.totalBudget)})`}
              </SubtleTextStyled>
            </SectionStyled>

            {/* Month over month */}
            <SectionStyled>
              <SectionTitleStyled>This month vs last</SectionTitleStyled>
              <RowStyled>
                <RowMainStyled>
                  <RowTitleStyled>
                    {fmt(insights.currentMonthTotal)}
                  </RowTitleStyled>
                  <SubtleTextStyled>
                    vs {fmt(insights.previousMonthTotal)} last month
                  </SubtleTextStyled>
                </RowMainStyled>
                {renderDelta(
                  insights.monthOverMonthDelta,
                  insights.monthOverMonthPercent,
                )}
              </RowStyled>
            </SectionStyled>

            {/* Biggest movers */}
            <SectionStyled>
              <SectionTitleStyled>
                Biggest movers vs last month
              </SectionTitleStyled>
              {insights.biggestMovers.length === 0 && (
                <EmptyTextStyled>No change from last month.</EmptyTextStyled>
              )}
              {insights.biggestMovers.map((m: any) => (
                <RowStyled key={m.categoryId}>
                  <RowMainStyled>
                    <RowTitleStyled>{m.categoryName}</RowTitleStyled>
                    <SubtleTextStyled>
                      {fmt(m.previousTotal)} &rarr; {fmt(m.currentTotal)}
                    </SubtleTextStyled>
                  </RowMainStyled>
                  {renderDelta(m.delta, m.percentChange)}
                </RowStyled>
              ))}
            </SectionStyled>

            {/* Top expenses */}
            <SectionStyled>
              <SectionTitleStyled>Top expenses</SectionTitleStyled>
              {insights.topExpenses.length === 0 && (
                <EmptyTextStyled>No expenses this month.</EmptyTextStyled>
              )}
              {insights.topExpenses.map((e: any) => (
                <RowStyled key={e.id}>
                  <RowMainStyled>
                    <RowTitleStyled>
                      {e.description || e.subcategoryName}
                    </RowTitleStyled>
                    <SubtleTextStyled>
                      {e.categoryName} &middot; {e.subcategoryName} &middot;{" "}
                      {dayjs(Number(e.date)).format("D MMM")}
                      {e.paidByName ? ` · ${e.paidByName}` : ""}
                    </SubtleTextStyled>
                  </RowMainStyled>
                  <RowRightStyled>
                    <span style={{ fontWeight: 600 }}>{fmt(e.amount)}</span>
                  </RowRightStyled>
                </RowStyled>
              ))}
            </SectionStyled>

            {/* On-budget streaks */}
            <SectionStyled>
              <SectionTitleStyled>On-budget streaks</SectionTitleStyled>
              {insights.streaks.length === 0 && (
                <EmptyTextStyled>
                  No on-budget streaks yet. Stay under budget to start one.
                </EmptyTextStyled>
              )}
              {insights.streaks.map((s: any) => (
                <RowStyled key={s.subcategoryId}>
                  <RowMainStyled>
                    <RowTitleStyled>{s.subcategoryName}</RowTitleStyled>
                    <SubtleTextStyled>{s.categoryName}</SubtleTextStyled>
                  </RowMainStyled>
                  <StreakBadgeStyled>
                    <LocalFireDepartmentIcon fontSize="small" />
                    {s.monthsUnderBudget} mo
                  </StreakBadgeStyled>
                </RowStyled>
              ))}
            </SectionStyled>

            {/* Pace by category */}
            <SectionStyled>
              <SectionTitleStyled>Pace by category</SectionTitleStyled>
              {insights.pace.filter((p: any) => p.budget > 0).length === 0 && (
                <EmptyTextStyled>No budgets set for this view.</EmptyTextStyled>
              )}
              {[...insights.pace]
                .filter((p: any) => p.budget > 0)
                .sort((a: any, b: any) => b.percentUsed - a.percentUsed)
                .map((p: any) => {
                  const over = p.projected > p.budget;
                  return (
                    <div key={p.categoryId} style={{ padding: "8px 0" }}>
                      <RowStyled style={{ padding: 0, borderTop: "none" }}>
                        <RowMainStyled>
                          <RowTitleStyled>{p.categoryName}</RowTitleStyled>
                        </RowMainStyled>
                        <RowRightStyled>
                          <span>
                            {fmt(p.spent)} / {fmt(p.budget)}
                          </span>
                          <SubtleTextStyled
                            style={{ color: over ? RED : undefined }}
                          >
                            proj. {fmt(p.projected)}
                          </SubtleTextStyled>
                        </RowRightStyled>
                      </RowStyled>
                      <BarTrackStyled>
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(100, Math.round(p.percentUsed))}%`,
                            background: over ? RED : TEAL,
                          }}
                        />
                      </BarTrackStyled>
                    </div>
                  );
                })}
            </SectionStyled>
          </>
        )}
      </InsightsWrapperStyled>
    </>
  );
};
