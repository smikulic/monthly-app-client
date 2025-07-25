import { FC, useContext } from "react";
import { ProgressBar } from "../progress-bar/progress-bar";
import {
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

  return (
    <>
      {budgetValue && (
        <BudgetAmountStyled positive={budgetValue - expenseValue > 0}>
          {formatAmount(budgetValue - expenseValue, userCurrency)}
        </BudgetAmountStyled>
      )}

      <ExpenseAmountStyled prominent={!budgetValue}>
        {formatAmount(expenseValue, userCurrency)}
      </ExpenseAmountStyled>

      {budgetValue && (
        <ProgressBar value={expenseValue} maxValue={budgetValue} />
      )}
    </>
  );
};
