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
  /**
   * What `budgetValue` means, which depends on the rollover toggle: the budget
   * for the month, or what is left of it. Two bare stacked numbers gave no way
   * to tell which was which, and the word changes with the toggle so it cannot
   * be hardcoded here.
   */
  budgetLabel?: string;
  /** Decided by the caller — what counts as over depends on the rollover toggle. */
  over?: boolean;
}

export const ListItemDetails: FC<Props> = ({
  expenseValue,
  budgetValue,
  budgetLabel,
  over,
}) => {
  const userCurrency = useContext(UserContext);
  const hasBudget = budgetValue !== undefined && budgetValue != null;

  return (
    <>
      <AmountColumnStyled>
        <ExpenseAmountStyled prominent={!hasBudget}>
          {formatAmount(expenseValue, userCurrency)}
        </ExpenseAmountStyled>

        {hasBudget && (
          <BudgetAmountStyled positive={budgetValue > 0}>
            {/* Absolute value with the word carrying the sign. A rolled-over
                budget can go negative, and "-180 € left" says the opposite of
                what it means. */}
            {formatAmount(Math.abs(budgetValue), userCurrency)}
            {budgetValue < 0 ? " over" : budgetLabel ? ` ${budgetLabel}` : ""}
          </BudgetAmountStyled>
        )}
      </AmountColumnStyled>

      {/* Rendered whenever there is a budget at all, including when it has
          been blown. Gating this on `budgetValue > 0` meant an over-budget row
          in rollover mode — where that figure is the remaining, so negative
          exactly when it matters — lost its wash entirely. */}
      {hasBudget && (
        <ProgressBar
          value={expenseValue}
          maxValue={budgetValue > 0 ? budgetValue : 1}
          over={over}
        />
      )}
    </>
  );
};
