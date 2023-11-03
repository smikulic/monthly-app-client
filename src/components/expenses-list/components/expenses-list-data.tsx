import React, { Dispatch, SetStateAction } from "react";
import { Expense } from "../../../generated/graphql";
import { CategoryDecoratedWithExpenses } from "../expenses-list";
import { ExpenseListItem } from "./expense-list-item";
import { CreateExpenseForm } from "../../create-expense-form/create-expense-form";
import { UpdateExpenseForm } from "../../update-expense-form/update-expense-form";

interface Props {
  pageDate: Date;
  showRolloverBudget: boolean;
  categoriesDecoratedWithExpenses: CategoryDecoratedWithExpenses[];
  openCategory: string;
  createModalExpense: boolean;
  updateModalExpense: Expense | null;
  setOpenCategory: Dispatch<SetStateAction<string>>;
  setCreateModalExpense: Dispatch<SetStateAction<boolean>>;
  setUpdateModalExpense: Dispatch<SetStateAction<Expense | null>>;
  refetchExpenses: () => Promise<unknown>;
}

export const ExpensesListData: React.FC<Props> = ({
  pageDate,
  showRolloverBudget,
  categoriesDecoratedWithExpenses,
  openCategory,
  createModalExpense,
  updateModalExpense,
  setOpenCategory,
  setCreateModalExpense,
  setUpdateModalExpense,
  refetchExpenses,
}) => {
  return (
    <>
      {categoriesDecoratedWithExpenses.map(
        (category: CategoryDecoratedWithExpenses) => {
          const categoryId = category.id;
          const expanded = openCategory === categoryId;

          return (
            <React.Fragment key={categoryId}>
              <ExpenseListItem
                pageDate={pageDate}
                showRolloverBudget={showRolloverBudget}
                category={category}
                openCategory={openCategory}
                setOpenCategory={setOpenCategory}
                setCreateModalExpense={setCreateModalExpense}
                setUpdateModalExpense={setUpdateModalExpense}
                refetchExpenses={refetchExpenses}
              />

              {expanded && (
                <>
                  {createModalExpense && (
                    <CreateExpenseForm
                      open={createModalExpense}
                      subcategories={category?.subcategories}
                      currentDate={pageDate}
                      closeForm={() => {
                        refetchExpenses();
                        setCreateModalExpense(false);
                      }}
                    />
                  )}
                  {updateModalExpense && (
                    <UpdateExpenseForm
                      open={Boolean(updateModalExpense)}
                      formData={updateModalExpense}
                      subcategories={category?.subcategories}
                      closeForm={() => {
                        refetchExpenses();
                        setUpdateModalExpense(null);
                      }}
                    />
                  )}
                </>
              )}
            </React.Fragment>
          );
        }
      )}
    </>
  );
};
