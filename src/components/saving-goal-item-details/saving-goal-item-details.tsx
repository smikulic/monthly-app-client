import React from "react";
import { ProgressBar } from "../progress-bar/progress-bar";
import {
  BudgetAmountStyled,
  ExpenseAmountStyled,
} from "./saving-goal-item-details-style";
import { formatAmount } from "../../utils/format";

interface Props {
  goalAmount: number;
  savedTillNow: number;
}

export const SavingGoalItemDetails: React.FC<Props> = ({
  goalAmount,
  savedTillNow,
}) => {
  return (
    <>
      <BudgetAmountStyled positive={true}>
        {formatAmount(savedTillNow)}
      </BudgetAmountStyled>

      <ExpenseAmountStyled prominent={false}>
        {formatAmount(goalAmount)}
      </ExpenseAmountStyled>

      <ProgressBar value={savedTillNow} maxValue={goalAmount} reverse />
    </>
  );
};
