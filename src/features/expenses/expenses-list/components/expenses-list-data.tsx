import { Fragment, FC } from "react";
import { Expense } from "@/generated/graphql";
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
  setOpenCategory: (categoryId: string) => void;
  setCreateModalExpense: (open: boolean) => void;
  setUpdateModalExpense: (expense: Expense | null) => void;
  refetchExpenses: () => Promise<unknown>;
}

export const ExpensesListData: FC<Props> = ({
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
            <Fragment key={categoryId}>
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
            </Fragment>
          );
        }
      )}
    </>
  );
};
