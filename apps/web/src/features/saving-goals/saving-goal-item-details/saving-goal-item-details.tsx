import React from "react";
import {
  SavingGoalBudgetAmountStyled,
  SavingGoalExpenseAmountStyled,
  SavingGoalItemDetailsContainerStyled,
} from "./saving-goal-item-details-style";
import { formatAmount } from "@/utils/format";
import { UserContext } from "@/App";

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
      {/* Labelled. Two bare amounts stacked gave no way to tell which was
          saved and which was the target. */}
      <SavingGoalExpenseAmountStyled prominent={true}>
        {formatAmount(savedTillNow, userCurrency)} saved
      </SavingGoalExpenseAmountStyled>

      <SavingGoalBudgetAmountStyled positive={true}>
        of {formatAmount(goalAmount, userCurrency)}
      </SavingGoalBudgetAmountStyled>
    </SavingGoalItemDetailsContainerStyled>
  );
};
