import { FC } from "react";
import { Expense } from "@/generated/graphql";
import { MainListItemStyled } from "@/shared";
import { ListItemHeader } from "../../list-item-header/list-item-header";
import { ListAddField } from "../../list-add-field/list-add-field";
import { ListItemDetails } from "../../list-item-details/list-item-details";
import { SubcategoryListItem } from "../../subcategory-list-item/subcategory-list-item";
import {
  CategoryDecoratedWithExpenses,
  SubcategoryDecoratedWithExpenses,
} from "../expenses-list";

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
  const categoryId = category.id;
  const showSubcategories = openCategory === categoryId;
  const subcategoriesExist = category.subcategories.length > 0;
  const isActive = showSubcategories && subcategoriesExist;

  return (
    <>
      <MainListItemStyled active={isActive}>
        <ListItemHeader
          title={category.name}
          showExpand={!showSubcategories && subcategoriesExist}
          showCollapse={isActive}
          onToggleExpand={() => {
            if (subcategoriesExist) {
              setOpenCategory(showSubcategories ? "" : categoryId);
            }
          }}
        />
        {category.totalExpenseAmount > 0 && (
          <ListItemDetails expenseValue={category.totalExpenseAmount} />
        )}
      </MainListItemStyled>
      {showSubcategories && (
        <>
          {subcategoriesExist &&
            category.subcategories.map(
              (
                subcategory: SubcategoryDecoratedWithExpenses,
                subcategoryKey: number
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
                    refetchExpenses={refetchExpenses}
                    setUpdateModalExpense={(expense: Expense) =>
                      setUpdateModalExpense(expense)
                    }
                  />
                );
              }
            )}

          <ListAddField
            text={`Add ${category.name} expense`}
            onClick={() => setCreateModalExpense(true)}
          />
        </>
      )}
    </>
  );
};
