import { HomeListItemLink } from "../home-list-item-link/home-list-item-link";
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
  // The grid places these directly; the previous flex-row wrappers were what
  // forced two full-width tiles into one row and overflowed on narrow screens.
  return (
    <HomeContainerStyled>
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
      {/* Carries the safe-to-spend sentence, so it takes the full row. */}
      <HomeListItemLink
        linkTo="/insights"
        title="Insights"
        loading={loading}
        value={insightsSummary || "Spending pace, trends & streaks"}
        wide
      />
    </HomeContainerStyled>
  );
};
