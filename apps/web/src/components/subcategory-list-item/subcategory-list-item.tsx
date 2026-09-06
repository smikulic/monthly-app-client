import { FC, useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { Expense } from "@/generated/graphql";
import {
  getAmountForMonth,
  getRemainingRolloverBudget,
} from "@/utils/getRolloverBudget";
import { GroupRowStyled } from "@/components/list-group/list-group-style";
import { GET_ALL_EXPENSES } from "../../pages/expenses-page/expenses-page-queries";
import { ExpandedExpenses } from "../expanded-expenses/expanded-expenses";
import { ListItemHeader } from "../list-item-header/list-item-header";
import { ListItemDetails } from "../list-item-details/list-item-details";
import { SubcategoryDecoratedWithExpenses } from "@/features/expenses/expenses-list/expenses-list";
import { getEndOfMonth } from "@/utils/getEndOfMonth";

interface Props {
  subcategory: SubcategoryDecoratedWithExpenses;
  subcategorySelected: SubcategoryDecoratedWithExpenses;
  currentDate: Date;
  showRolloverBudget: boolean;
  categoryGroupId?: string | null;
  refetchExpenses: () => Promise<unknown>;
  setUpdateModalExpense: (expense: Expense) => void;
}

export const SubcategoryListItem: FC<Props> = ({
  subcategory,
  subcategorySelected,
  currentDate,
  showRolloverBudget,
  categoryGroupId,
  refetchExpenses,
  setUpdateModalExpense,
}) => {
  const [openSubcategory, setOpenSubcategory] = useState("");

  const { data: expensesData } = useQuery(GET_ALL_EXPENSES);

  // The amount schedule. Older cached responses may not carry it, in which case
  // everything below falls back to the flat pair and behaves as it always did.
  const periods = (subcategory.budgets ?? []).map((budget) => ({
    amount: budget.amount,
    validFrom: new Date(Number(budget.validFrom)),
  }));

  // Where the schedule opens is where accrual starts. The server keeps
  // rolloverDate in step with it, so this only differs on stale data.
  const rolloverDate = periods.length
    ? periods.reduce((earliest, period) =>
        period.validFrom < earliest.validFrom ? period : earliest
      ).validFrom
    : new Date(Number(subcategory.rolloverDate));

  // Where we build the expenses list for the viewed month
  const monthEnd = getEndOfMonth(currentDate);

  const expensesSinceRollover = (expensesData?.expenses || []).filter(
    (expense: Expense) => {
      const dt = new Date(Number(expense.date));
      return (
        dt >= rolloverDate && // from rollover start
        dt <= monthEnd && // up to end of viewed month
        expense.subcategoryId === subcategory.id
      );
    },
  );

  // Summing the filtered expenses
  const totalExpensesSinceRollover = expensesSinceRollover.reduce(
    (acc: number, expense: { amount: number }) => acc + expense.amount,
    0,
  );

  // Remaining rollover for the viewed month
  const remainingRolloverBudget = getRemainingRolloverBudget({
    currentDate,
    rolloverDate,
    budgetAmount: subcategory.budgetAmount || 0,
    totalExpensesSinceRollover,
    periods,
  });

  const subcategoryId = subcategory.id;
  const showExpenses = openSubcategory === subcategoryId;
  const totalSubcategoryExpenses = subcategory.expenses.reduce(
    (accumulator: number, currentValue: Expense) =>
      accumulator + currentValue.amount,
    0,
  );

  const expensesExist = totalSubcategoryExpenses > 0;
  // What the budget was in the month being viewed, so looking back at a month
  // before a raise reports the figure that actually applied then.
  const budgetAmount = periods.length
    ? (getAmountForMonth({ periods, currentDate }) ?? 0)
    : subcategory.budgetAmount || 0;

  const budgetValue = showRolloverBudget
    ? remainingRolloverBudget
    : budgetAmount;

  const current = dayjs(currentDate);
  const rollover = dayjs(rolloverDate);

  const isCurrentDateMonthAfterOrEqual =
    current.year() > rollover.year() ||
    (current.year() === rollover.year() && current.month() >= rollover.month());

  return (
    <>
      <GroupRowStyled actionable={expensesExist}>
        <ListItemHeader
          title={subcategory.name}
          showExpand={!showExpenses && expensesExist}
          showCollapse={showExpenses && expensesExist}
          onToggleExpand={() => {
            if (expensesExist) {
              setOpenSubcategory(showExpenses ? "" : subcategoryId);
            }
          }}
        />

        <ListItemDetails
          expenseValue={totalSubcategoryExpenses}
          budgetValue={isCurrentDateMonthAfterOrEqual ? budgetValue : undefined}
        />
      </GroupRowStyled>
      {showExpenses && (
        <>
          {!!subcategorySelected && (
            <ExpandedExpenses
              expenses={subcategorySelected.expenses}
              categoryGroupId={categoryGroupId}
              setUpdateModalExpense={setUpdateModalExpense}
              refetchExpenses={refetchExpenses}
            />
          )}
        </>
      )}
    </>
  );
};
