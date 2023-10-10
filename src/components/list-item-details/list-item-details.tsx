import React from "react";
import { styled } from "@mui/material/styles";
import { ProgressBar } from "../progress-bar/progress-bar";

type BudgetAmountStyledProps = {
  positive: boolean;
};
type ExpenseAmountStyledProps = {
  prominent: boolean;
};

const BudgetAmountStyled = styled("div")<BudgetAmountStyledProps>(
  ({ positive }) => ({
    position: "absolute",
    top: "28px",
    right: "32px",
    fontSize: "14px",
    color: positive ? "#7fb77e" : "#ff7777",
  })
);
const ExpenseAmountStyled = styled("div")<ExpenseAmountStyledProps>(
  ({ prominent }) => ({
    position: "absolute",
    top: prominent ? "18px" : "10px",
    right: "32px",
    fontSize: prominent ? "16px" : "14px",
    color: "#181818",
  })
);

interface Props {
  expenseValue: number;
  budgetValue?: number;
}

export const ListItemDetails: React.FC<Props> = ({
  expenseValue,
  budgetValue,
}) => {
  return (
    <>
      {budgetValue && (
        <BudgetAmountStyled positive={budgetValue - expenseValue > 0}>
          {budgetValue - expenseValue} €
        </BudgetAmountStyled>
      )}

      <ExpenseAmountStyled prominent={!budgetValue}>
        {expenseValue} €
      </ExpenseAmountStyled>

      {budgetValue && (
        <ProgressBar value={expenseValue} maxValue={budgetValue} />
      )}
    </>
  );
};
