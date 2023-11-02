import React, { Dispatch, SetStateAction } from "react";
import { Expense } from "../../../generated/graphql";
import { ListItemHeader } from "../../list-item-header/list-item-header";
import { CreateExpenseForm } from "../../create-expense-form/create-expense-form";
import { UpdateExpenseForm } from "../../update-expense-form/update-expense-form";
import { ListAddField } from "../../list-add-field/list-add-field";
import { ListItemDetails } from "../../list-item-details/list-item-details";
import { SubcategoryListItem } from "../../subcategory-list-item/subcategory-list-item";
import { MainListItemStyled } from "../../../shared";
import {
  CategoryDecoratedWithExpenses,
  SubcategoryDecoratedWithExpenses,
} from "../expenses-list";

interface Props {
  pageDate: Date;
  showRolloverBudget: boolean;
  category: CategoryDecoratedWithExpenses;
  openCategory: string;
  createModalExpense: boolean;
  updateModalExpense: Expense | null;
  setOpenCategory: Dispatch<SetStateAction<string>>;
  setCreateModalExpense: Dispatch<SetStateAction<boolean>>;
  setUpdateModalExpense: Dispatch<SetStateAction<Expense | null>>;
  refetchExpenses: () => Promise<unknown>;
}

export const ExpenseListItem: React.FC<Props> = ({
  pageDate,
  showRolloverBudget,
  category,
  openCategory,
  createModalExpense,
  updateModalExpense,
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
              if (showSubcategories) {
                setOpenCategory("");
              } else {
                setOpenCategory(categoryId);
              }
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

          {createModalExpense && (
            <CreateExpenseForm
              open={createModalExpense}
              subcategories={category?.subcategories}
              currentDate={pageDate}
              closeForm={() => setCreateModalExpense(false)}
              refetch={refetchExpenses}
            />
          )}
          {updateModalExpense && (
            <UpdateExpenseForm
              open={Boolean(updateModalExpense)}
              formData={updateModalExpense}
              subcategories={category?.subcategories}
              closeForm={() => setUpdateModalExpense(null)}
              refetch={refetchExpenses}
            />
          )}
        </>
      )}
    </>
  );
};
