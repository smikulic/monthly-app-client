import { FC } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Expense } from "@/generated/graphql";
import { ListItemHeader } from "@/components/list-item-header/list-item-header";
import { SharedGroupBadge } from "@/features/groups/shared-group-badge";
import { useScope } from "@/features/groups/scope-context";
import { ListItemDetails } from "@/components/list-item-details/list-item-details";
import { SubcategoryListItem } from "@/components/subcategory-list-item/subcategory-list-item";
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
}

export const ExpenseListItem: FC<Props> = ({
  pageDate,
  showRolloverBudget,
  category,
  openCategory,
  setOpenCategory,
  setCreateModalExpense,
  setUpdateModalExpense,
  refetchExpenses,
}) => {
  const { mode } = useScope();
  const categoryId = category.id;
  const showSubcategories = openCategory === categoryId;
  const subcategoriesExist = category.subcategories.length > 0;
  const isActive = showSubcategories && subcategoriesExist;

  return (
    <GroupCardStyled active={isActive}>
      <GroupHeaderRowStyled>
        <ListItemHeader
          title={category.name}
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
        {category.totalExpenseAmount > 0 && (
          <ListItemDetails expenseValue={category.totalExpenseAmount} />
        )}
      </GroupHeaderRowStyled>

      {showSubcategories && (
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

          <GroupAddRowStyled onClick={() => setCreateModalExpense(true)}>
            <AddIcon />
            Add expense
          </GroupAddRowStyled>
        </>
      )}
    </GroupCardStyled>
  );
};
