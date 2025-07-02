import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { Expense } from "@/generated/graphql";
import { SubcategoryListItemStyled } from "@/shared";
import { getRemainingRolloverBudget } from "@/utils/getRolloverBudget";
import { GET_ALL_EXPENSES } from "../expenses-list/expenses-list-queries";
import { ExpandedExpenses } from "../expanded-expenses/expanded-expenses";
import { ListItemHeader } from "../list-item-header/list-item-header";
import { ListItemDetails } from "../list-item-details/list-item-details";
import { SubcategoryDecoratedWithExpenses } from "../expenses-list/expenses-list";

interface Props {
  subcategory: SubcategoryDecoratedWithExpenses;
  subcategorySelected: SubcategoryDecoratedWithExpenses;
  currentDate: Date;
  showRolloverBudget: boolean;
  refetchExpenses: () => Promise<unknown>;
  setUpdateModalExpense: (expense: Expense) => void;
}

export const SubcategoryListItem: React.FC<Props> = ({
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
  const expensesSinceRollover = (expensesData?.expenses || []).filter(
    (expense: Expense) => {
      return (
        new Date(Number(expense.date)) >= rolloverDate &&
        expense.subcategoryId === subcategory.id
      );
    }
  );

  // Summing the filtered expenses
  const totalExpensesSinceRollover = expensesSinceRollover.reduce(
    (acc: number, expense: { amount: number }) => acc + expense.amount,
    0
  );

  // Calculate the remaining rollover budget using the updated function
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
