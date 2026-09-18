import { Box } from "@/components/ui/Box";
import { styled } from "@mui/material/styles";
import { tokens } from "@/theme/tokens";

type SavingGoalBudgetAmountStyledProps = {
  positive: boolean;
};

type SavingGoalExpenseAmountStyledProps = {
  prominent: boolean;
};

export const SavingGoalBudgetAmountStyled = styled(
  "div",
)<SavingGoalBudgetAmountStyledProps>(({ theme, positive }) => ({
  position: "relative",
  fontSize: tokens.fontSize.sm,
  // Quiet while on track, coloured only when it is not — same reason as the
  // budget rows: colouring the healthy case makes the colour meaningless.
  color: positive ? theme.palette.text.secondary : theme.palette.money.negative,
}));

export const SavingGoalExpenseAmountStyled = styled(
  "div",
)<SavingGoalExpenseAmountStyledProps>(({ theme, prominent }) => ({
  position: "relative",
  fontSize: prominent ? "16px" : "14px",
  color: theme.palette.text.primary,
}));

export const SavingGoalItemDetailsContainerStyled = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "end",
  justifyContent: "center",
  position: "relative",
  height: "42px",
});
