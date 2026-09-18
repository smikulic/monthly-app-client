import { FC } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Expense } from "@/generated/graphql";
import { ListItemHeader } from "@/components/list-item-header/list-item-header";
import { SharedGroupBadge } from "@/features/groups/shared-group-badge";
import { useScope } from "@/features/groups/scope-context";
import { ListItemDetails } from "@/components/list-item-details/list-item-details";
import { SubcategoryListItem } from "@/components/subcategory-list-item/subcategory-list-item";
import { Collapse } from "@/components/ui/Collapse";
import { getBudgetStatus } from "@/utils/budgetStatus";
import {
  CategoryDecoratedWithExpenses,
  SubcategoryDecoratedWithExpenses,
} from "../expenses-list";
import {
  GroupCardStyled,
  GroupHeaderRowStyled,
  GroupAddRowStyled,
} from "@/components/list-group/list-group-style";

interface Props {
  pageDate: Date;
  showRolloverBudget: boolean;
  category: CategoryDecoratedWithExpenses;
  openCategory: string;
  setOpenCategory: (categoryId: string) => void;
  setCreateModalExpense: (open: boolean) => void;
  setUpdateModalExpense: (expense: Expense | null) => void;
  refetchExpenses: () => Promise<unknown>;
  /**
   * Set on the first row only, so the first-run tour has one stable thing to
   * point at on a list whose contents are entirely the user's own.
   */
  dataTour?: string;
}

export const ExpenseListItem: FC<Props> = ({
  pageDate,
  showRolloverBudget,
  category,
  dataTour,
  openCategory,
  setOpenCategory,
  setCreateModalExpense,
  setUpdateModalExpense,
  refetchExpenses,
}) => {
  const { mode } = useScope();
  const categoryId = category.id;
  const showSubcategories = openCategory === categoryId;

  // Same rule as the subcategory rows beneath, so a category cannot read as
  // under budget while a child of it reads as over.
  const { budgetValue, hasStarted, over, label } = getBudgetStatus({
    showRollover: showRolloverBudget,
    budgetForMonth: category.totalBudgetForMonth,
    rolloverRemaining: category.totalRolloverRemaining,
    spent: category.totalExpenseAmount,
  });
  const subcategoriesExist = category.subcategories.length > 0;
  const isActive = showSubcategories && subcategoriesExist;

  return (
    <GroupCardStyled active={isActive} data-tour={dataTour}>
      <GroupHeaderRowStyled>
        <ListItemHeader
          title={category.name}
          dataTour={dataTour ? "expense-category-header" : undefined}
          showExpand={!showSubcategories && subcategoriesExist}
          showCollapse={isActive}
          onToggleExpand={() => {
            if (subcategoriesExist) {
              setOpenCategory(showSubcategories ? "" : categoryId);
            }
          }}
          badge={
            mode === "ALL" ? (
              <SharedGroupBadge groupId={category.groupId} />
            ) : undefined
          }
        />
        {/* Always rendered, and with a budget. Gated on spend > 0 and given
            no budgetValue, a category with nothing spent yet showed nothing at
            all — and no category row ever showed its budget or its progress
            wash, which is most of what this page is for. */}
        <ListItemDetails
          expenseValue={category.totalExpenseAmount}
          budgetValue={hasStarted ? budgetValue : undefined}
          budgetLabel={label}
          over={over}
        />
      </GroupHeaderRowStyled>

      <Collapse in={showSubcategories}>
        <>
          {subcategoriesExist &&
            category.subcategories.map(
              (
                subcategory: SubcategoryDecoratedWithExpenses,
                subcategoryKey: number,
              ) => {
                if (!subcategory) return null;

                const subcategorySelected =
                  category?.subcategories[subcategoryKey];

                return (
                  <SubcategoryListItem
                    key={subcategory.id}
                    subcategory={subcategory}
                    subcategorySelected={subcategorySelected}
                    currentDate={pageDate}
                    showRolloverBudget={showRolloverBudget}
                    categoryGroupId={category.groupId}
                    refetchExpenses={refetchExpenses}
                    setUpdateModalExpense={(expense: Expense) =>
                      setUpdateModalExpense(expense)
                    }
                  />
                );
              },
            )}

          <GroupAddRowStyled
            onClick={() => setCreateModalExpense(true)}
            data-tour={dataTour ? "add-expense" : undefined}
          >
            <AddIcon />
            Add expense
          </GroupAddRowStyled>
        </>
      </Collapse>
    </GroupCardStyled>
  );
};
