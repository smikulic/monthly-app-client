import { FC, useContext } from "react";
import { ProgressBar } from "../progress-bar/progress-bar";
import {
  AmountColumnStyled,
  BudgetAmountStyled,
  ExpenseAmountStyled,
} from "./list-item-details-style";
import { formatAmount } from "../../utils/format";
import { UserContext } from "../../App";

interface Props {
  expenseValue: number;
  budgetValue?: number;
}

export const ListItemDetails: FC<Props> = ({ expenseValue, budgetValue }) => {
  const userCurrency = useContext(UserContext);
  const hasBudget = budgetValue !== undefined && budgetValue != null;
  const isPositiveBudget = hasBudget && budgetValue > 0;

  return (
    <>
      <AmountColumnStyled>
        <ExpenseAmountStyled prominent={!hasBudget}>
          {formatAmount(expenseValue, userCurrency)}
        </ExpenseAmountStyled>

        {hasBudget && (
          <BudgetAmountStyled positive={budgetValue > 0}>
            {formatAmount(budgetValue, userCurrency)}
          </BudgetAmountStyled>
        )}
      </AmountColumnStyled>

      {isPositiveBudget && (
        <ProgressBar value={expenseValue} maxValue={budgetValue} />
      )}
    </>
  );
};
