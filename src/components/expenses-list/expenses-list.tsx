import React, { useState } from "react";
import { Category, Subcategory, Expense } from "../../generated/graphql";
import { ListItemHeader } from "../list-item-header/list-item-header";
import { CreateExpenseForm } from "../create-expense-form/create-expense-form";
import { UpdateExpenseForm } from "../update-expense-form/update-expense-form";
import { ListAddField } from "../list-add-field/list-add-field";
import { ListItemDetails } from "../list-item-details/list-item-details";
import { SubcategoryListItem } from "../subcategory-list-item/subcategory-list-item";
import { MainListItemStyled } from "../../shared";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export interface SubcategoryDecoratedWithExpenses extends Subcategory {
  expenses: Expense[];
}

export interface CategoryDecoratedWithExpenses extends Category {
  totalExpenseAmount: number;
  subcategories: SubcategoryDecoratedWithExpenses[];
}

interface Props {
  data: CategoryDecoratedWithExpenses[];
  totalSubcategories: number;
  currentDate: Date;
  showRolloverBudget: boolean;
  refetchExpenses: () => Promise<unknown>;
}

export const ExpensesList: React.FC<Props> = ({
  data,
  totalSubcategories,
  currentDate,
  showRolloverBudget,
  refetchExpenses,
}) => {
  const [openCategory, setOpenCategory] = useState("");
  const [createModalExpense, setCreateModalExpense] = React.useState(false);
  const [updateModalExpense, setUpdateModalExpense] =
    React.useState<Expense | null>(null);

  return (
    <div>
      {totalSubcategories === 0 && (
        <>
          <Alert severity="info">
            <AlertTitle>
              Create a category and subcategory to enable adding an expense.
            </AlertTitle>
            <strong>Example:</strong> "Food" can be category, "Groceries" and
            "Restaurant" subcategories.
            <br />
            Or to keep it simple, just create a subcategory "all"
          </Alert>
        </>
      )}
      {totalSubcategories > 0 &&
        data.map((category: CategoryDecoratedWithExpenses) => {
          if (!category) return null;

          const categoryId = category.id;
          const showSubcategories = openCategory === categoryId;

          const subcategoriesExist = category.subcategories.length > 0;

          return (
            <React.Fragment key={categoryId}>
              <MainListItemStyled>
                <ListItemHeader
                  title={category.name}
                  showExpand={!showSubcategories && subcategoriesExist}
                  showCollapse={showSubcategories && subcategoriesExist}
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
                            currentDate={currentDate}
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
                      currentDate={currentDate}
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
            </React.Fragment>
          );
        })}
    </div>
  );
};
