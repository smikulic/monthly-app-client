import { HomeListItemLink } from "../home-list-item-link/home-list-item-link";
import { Box } from "@/components/ui/Box";
import { tokens } from "@/theme/tokens";
import { HomeContainerStyled } from "./home-page-list-style";

// Wayfinding markers, in row order. Categorical hues, none of which is a money
// colour — a permanently red Expenses row would say spending is a failure, and
// would blunt the red that marks an actually over-budget category.
const [expenses, budget, savingGoals, investments, insights] = tokens.section;

/**
 * Investments is hidden from the dashboard for now. The feature and its page
 * are untouched and still reachable — this only removes the row.
 *
 * Flip to `true` to bring it back; the row below is left intact so that is a
 * one-line change rather than a rewrite.
 */
const SHOW_INVESTMENTS = false;

export const HomePageList = ({
  loading,
  totalExpensesAmount,
  totalBudgetAmount,
  totalSavingGoalsAmount,
  totalInvestmentsValue,
  insightsValue,
  insightsCaption,
  insightsTone = "neutral",
}: {
  loading: boolean;
  totalExpensesAmount: number;
  totalBudgetAmount: number;
  totalSavingGoalsAmount: number;
  totalInvestmentsValue: number;
  insightsValue: number | string;
  insightsCaption?: string;
  insightsTone?: "neutral" | "negative";
}) => {
  return (
    <HomeContainerStyled>
      <Box>
        <HomeListItemLink
          linkTo="/expenses"
          title="Expenses"
          dataTour="home-expenses"
          loading={loading}
          value={totalExpensesAmount}
          valueColor={expenses}
        />
        <HomeListItemLink
          linkTo="/budget"
          title="Budget"
          dataTour="home-budget"
          loading={loading}
          value={totalBudgetAmount}
          valueColor={budget}
        />
        <HomeListItemLink
          linkTo="/saving-goals"
          title="Saving Goals"
          loading={loading}
          value={totalSavingGoalsAmount}
          valueColor={savingGoals}
        />
        {SHOW_INVESTMENTS && (
          <HomeListItemLink
            linkTo="/investments"
            title="Investments"
            loading={loading}
            value={totalInvestmentsValue}
            valueColor={investments}
          />
        )}
        <HomeListItemLink
          linkTo="/insights"
          title="Insights"
          dataTour="home-insights"
          loading={loading}
          value={insightsValue}
          caption={insightsCaption}
          tone={insightsTone}
          valueColor={insights}
        />
      </Box>
    </HomeContainerStyled>
  );
};
