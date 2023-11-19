import React from "react";
import {
  SavingGoalBudgetAmountStyled,
  SavingGoalExpenseAmountStyled,
  SavingGoalItemDetailsContainerStyled,
} from "./saving-goal-item-details-style";
import { formatAmount } from "../../utils/format";
import { UserContext } from "../../App";

interface Props {
  goalAmount: number;
  savedTillNow: number;
}

export const SavingGoalItemDetails: React.FC<Props> = ({
  goalAmount,
  savedTillNow,
}) => {
  const userCurrency = React.useContext(UserContext);

  return (
    <SavingGoalItemDetailsContainerStyled>
      <SavingGoalBudgetAmountStyled positive={true}>
        {formatAmount(savedTillNow, userCurrency)}
      </SavingGoalBudgetAmountStyled>

      <SavingGoalExpenseAmountStyled prominent={false}>
        {formatAmount(goalAmount, userCurrency)}
      </SavingGoalExpenseAmountStyled>
    </SavingGoalItemDetailsContainerStyled>
  );
};
