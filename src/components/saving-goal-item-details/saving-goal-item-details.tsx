import React from "react";
import {
  SavingGoalBudgetAmountStyled,
  SavingGoalExpenseAmountStyled,
  SavingGoalItemDetailsContainerStyled,
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
    <SavingGoalItemDetailsContainerStyled>
      <SavingGoalBudgetAmountStyled positive={true}>
        {formatAmount(savedTillNow)}
      </SavingGoalBudgetAmountStyled>

      <SavingGoalExpenseAmountStyled prominent={false}>
        {formatAmount(goalAmount)}
      </SavingGoalExpenseAmountStyled>
    </SavingGoalItemDetailsContainerStyled>
  );
};
