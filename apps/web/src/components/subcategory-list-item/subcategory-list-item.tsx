import { FC, useState } from "react";
import { Expense } from "@/generated/graphql";
import { GroupRowStyled } from "@/components/list-group/list-group-style";
import { Collapse } from "@/components/ui/Collapse";
import { getBudgetStatus } from "@/utils/budgetStatus";
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
  // The mode and over-budget rules are shared with the category row above.
  const {
    budgetValue,
    hasStarted,
    over: overBudget,
    label,
  } = getBudgetStatus({
    showRollover: showRolloverBudget,
    budgetForMonth: subcategory.budgetForMonth,
    rolloverRemaining: subcategory.rolloverRemaining,
    spent: totalSubcategoryExpenses,
  });

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
          budgetLabel={label}
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
