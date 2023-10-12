import React from "react";
import { ProgressBar } from "../progress-bar/progress-bar";
import {
  BudgetAmountStyled,
  ExpenseAmountStyled,
} from "./list-item-details-style";

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
