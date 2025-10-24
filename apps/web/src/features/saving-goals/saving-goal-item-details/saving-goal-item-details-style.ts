import { Box } from "@/components/ui/Box";
import { styled } from "@mui/material/styles";

type SavingGoalBudgetAmountStyledProps = {
  positive: boolean;
};

type SavingGoalExpenseAmountStyledProps = {
  prominent: boolean;
};

export const SavingGoalBudgetAmountStyled = styled(
  "div"
)<SavingGoalBudgetAmountStyledProps>(({ positive }) => ({
  position: "relative",
  fontSize: "14px",
  color: positive ? "#7fb77e" : "#ff7777",
}));

export const SavingGoalExpenseAmountStyled = styled(
  "div"
)<SavingGoalExpenseAmountStyledProps>(({ prominent }) => ({
  position: "relative",
  fontSize: prominent ? "16px" : "14px",
  color: "#181818",
}));

export const SavingGoalItemDetailsContainerStyled = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "end",
  justifyContent: "center",
  position: "relative",
  height: "42px",
});
