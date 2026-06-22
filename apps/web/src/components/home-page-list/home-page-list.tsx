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
        <HomeListItemLink
          linkTo="/investments"
          title="Investments"
          loading={loading}
          value={totalInvestmentsValue}
          valueColor="#7fb77e"
        />
        <HomeListItemLink
          linkTo="/insights"
          title="Insights"
          loading={loading}
          value={insightsSummary || "Spending pace, trends & streaks"}
          valueColor="#3bceb1"
        />
      </Box>
    </HomeContainerStyled>
  );
};
