import React from "react";
import { ProgressBar } from "../progress-bar/progress-bar";
import {
  BudgetAmountStyled,
  ExpenseAmountStyled,
} from "./list-item-details-style";
import { formatAmount } from "../../utils/format";

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
          {formatAmount(budgetValue - expenseValue)}
        </BudgetAmountStyled>
      )}

      <ExpenseAmountStyled prominent={!budgetValue}>
        {formatAmount(expenseValue)}
      </ExpenseAmountStyled>

      {budgetValue && (
        <ProgressBar value={expenseValue} maxValue={budgetValue} />
      )}
    </>
  );
};
