import { HomeListItemLink } from "../home-list-item-link/home-list-item-link";
import { Box } from "@/components/ui/Box";
import { HomeContainerStyled } from "./home-page-list-style";

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
        />
        <HomeListItemLink
          linkTo="/budget"
          title="Budget"
          loading={loading}
          value={totalBudgetAmount}
        />
        <HomeListItemLink
          linkTo="/saving-goals"
          title="Saving Goals"
          loading={loading}
          value={totalSavingGoalsAmount}
        />
        <HomeListItemLink
          linkTo="/investments"
          title="Investments"
          loading={loading}
          value={totalInvestmentsValue}
        />
        <HomeListItemLink
          linkTo="/insights"
          title="Insights"
          loading={loading}
          value={insightsSummary || "Spending pace, trends & streaks"}
        />
      </Box>
    </HomeContainerStyled>
  );
};
