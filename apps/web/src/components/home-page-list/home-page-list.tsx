import { HomeListItemLink } from "../home-list-item-link/home-list-item-link";
import { Box } from "@/components/ui/Box";
import { tokens } from "@/theme/tokens";
import { HomeContainerStyled } from "./home-page-list-style";

// Wayfinding markers, in row order. Deliberately one hue in five steps rather
// than five arbitrary colours: the old set gave Expenses red and Investments
// green, which told the user spending was a failure and investing a success.
const [expenses, budget, savingGoals, investments, insights] = tokens.section;

export const HomePageList = ({
  loading,
  totalExpensesAmount,
  totalBudgetAmount,
  totalSavingGoalsAmount,
  totalInvestmentsValue,
  insightsSummary,
}: {
  loading: boolean;
  totalExpensesAmount: number;
  totalBudgetAmount: number;
  totalSavingGoalsAmount: number;
  totalInvestmentsValue: number;
  insightsSummary?: string;
}) => {
  return (
    <HomeContainerStyled>
      <Box>
        <HomeListItemLink
          linkTo="/expenses"
          title="Expenses"
          loading={loading}
          value={totalExpensesAmount}
          valueColor={expenses}
        />
        <HomeListItemLink
          linkTo="/budget"
          title="Budget"
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
        <HomeListItemLink
          linkTo="/investments"
          title="Investments"
          loading={loading}
          value={totalInvestmentsValue}
          valueColor={investments}
        />
        <HomeListItemLink
          linkTo="/insights"
          title="Insights"
          loading={loading}
          value={insightsSummary || "Spending pace, trends & streaks"}
          valueColor={insights}
        />
      </Box>
    </HomeContainerStyled>
  );
};
