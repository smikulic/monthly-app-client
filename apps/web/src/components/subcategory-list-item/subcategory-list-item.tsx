import { FC, useState } from "react";
import { Expense } from "@/generated/graphql";
import { GroupRowStyled } from "@/components/list-group/list-group-style";
import { Collapse } from "@/components/ui/Collapse";
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

  // What counts as over differs by mode, and only here are both figures known:
  // with rollover on `budgetValue` is what remains, so over means it went
  // negative; with it off `budgetValue` is the month's budget, so over means
  // spend passed it.
  const overBudget =
    hasStarted &&
    (showRolloverBudget
      ? budgetValue < 0
      : totalSubcategoryExpenses > budgetValue);

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
          budgetLabel={showRolloverBudget ? "left" : "budget"}
          over={overBudget}
        />
      </GroupRowStyled>
      <Collapse in={showExpenses}>
        {!!subcategorySelected && (
          <ExpandedExpenses
            expenses={subcategorySelected.expenses}
            categoryGroupId={categoryGroupId}
            setUpdateModalExpense={setUpdateModalExpense}
            refetchExpenses={refetchExpenses}
          />
        )}
      </Collapse>
    </>
  );
};
