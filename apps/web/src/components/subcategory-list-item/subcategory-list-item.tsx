import { FC, useState } from "react";
import { Expense } from "@/generated/graphql";
import { GroupRowStyled } from "@/components/list-group/list-group-style";
import { ExpandedExpenses } from "../expanded-expenses/expanded-expenses";
import { ListItemHeader } from "../list-item-header/list-item-header";
import { ListItemDetails } from "../list-item-details/list-item-details";
import { SubcategoryDecoratedWithExpenses } from "@/features/expenses/expenses-list/expenses-list";

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

  const subcategoryId = subcategory.id;
  const showExpenses = openSubcategory === subcategoryId;
  const totalSubcategoryExpenses = subcategory.expenses.reduce(
    (accumulator: number, currentValue: Expense) =>
      accumulator + currentValue.amount,
    0,
  );

  const expensesExist = totalSubcategoryExpenses > 0;

  // Both figures come from the server, which owns the schedule and the accrual.
  const budgetValue = showRolloverBudget
    ? subcategory.rolloverRemaining
    : subcategory.budgetForMonth;

  // Nothing to show for a month the budget did not exist in yet.
  const hasStarted = subcategory.budgetForMonth > 0;

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
          budgetValue={hasStarted ? budgetValue : undefined}
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
