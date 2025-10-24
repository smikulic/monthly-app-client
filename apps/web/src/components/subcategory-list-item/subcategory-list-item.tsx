import { FC, useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { Expense } from "@/generated/graphql";
import { SubcategoryListItemStyled } from "@/shared";
import { getRemainingRolloverBudget } from "@/utils/getRolloverBudget";
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
  refetchExpenses: () => Promise<unknown>;
  setUpdateModalExpense: (expense: Expense) => void;
}

export const SubcategoryListItem: FC<Props> = ({
  subcategory,
  subcategorySelected,
  currentDate,
  showRolloverBudget,
  refetchExpenses,
  setUpdateModalExpense,
}) => {
  const [openSubcategory, setOpenSubcategory] = useState("");

  const { data: expensesData } = useQuery(GET_ALL_EXPENSES);

  const rolloverDate = new Date(Number(subcategory.rolloverDate));

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
    }
  );

  // Summing the filtered expenses
  const totalExpensesSinceRollover = expensesSinceRollover.reduce(
    (acc: number, expense: { amount: number }) => acc + expense.amount,
    0
  );

  // Remaining rollover for the viewed month
  const remainingRolloverBudget = getRemainingRolloverBudget({
    currentDate,
    rolloverDate,
    budgetAmount: subcategory.budgetAmount || 0,
    totalExpensesSinceRollover,
  });

  const subcategoryId = subcategory.id;
  const showExpenses = openSubcategory === subcategoryId;
  const totalSubcategoryExpenses = subcategory.expenses.reduce(
    (accumulator: number, currentValue: Expense) =>
      accumulator + currentValue.amount,
    0
  );

  const expensesExist = totalSubcategoryExpenses > 0;
  const budgetAmount = subcategory.budgetAmount || 0;

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
      <SubcategoryListItemStyled actionable={expensesExist}>
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
      </SubcategoryListItemStyled>
      {showExpenses && (
        <>
          {!!subcategorySelected && (
            <ExpandedExpenses
              expenses={subcategorySelected.expenses}
              setUpdateModalExpense={setUpdateModalExpense}
              refetchExpenses={refetchExpenses}
            />
          )}
        </>
      )}
    </>
  );
};
