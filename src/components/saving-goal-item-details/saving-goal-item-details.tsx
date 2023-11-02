import React from "react";
import { ProgressBar } from "../progress-bar/progress-bar";
import {
  BudgetAmountStyled,
  ExpenseAmountStyled,
} from "./saving-goal-item-details-style";
import { formatAmount } from "../../utils/format";
import { Box } from "@mui/material";

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
      <Box
        sx={{
          height: "42px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BudgetAmountStyled positive={true}>
          {formatAmount(savedTillNow)}
        </BudgetAmountStyled>

        <ExpenseAmountStyled prominent={false}>
          {formatAmount(goalAmount)}
        </ExpenseAmountStyled>
      </Box>

      <ProgressBar value={savedTillNow} maxValue={goalAmount} reverse />
    </>
  );
};
