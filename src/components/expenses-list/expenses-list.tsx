import React from "react";
import { Category, Subcategory, Expense } from "@/generated/graphql";
import { ListLoading } from "@/components/ui/ListLoading";
import { ExpensesListNoData } from "./components/expenses-list-no-data";
import { ExpensesListData } from "./components/expenses-list-data";

export interface SubcategoryDecoratedWithExpenses extends Subcategory {
  expenses: Expense[];
}

export interface CategoryDecoratedWithExpenses extends Category {
  subcategories: SubcategoryDecoratedWithExpenses[];
  totalExpenseAmount: number;
}

interface Props {
  loading: boolean;
  totalSubcategories: number;
  pageDate: Date;
  showRolloverBudget: boolean;
  categoriesDecoratedWithExpenses?: CategoryDecoratedWithExpenses[];
  openCategory: string;
  createModalExpense: boolean;
  updateModalExpense: Expense | null;
  onSetOpenCategory: (categoryId: string) => void;
  onSetCreateModalExpense: (open: boolean) => void;
  onSetUpdateModalExpense: (expense: Expense | null) => void;
  refetchExpenses: () => Promise<unknown>;
}

export const ExpensesList: React.FC<Props> = ({
  loading,
  totalSubcategories,
  pageDate,
  showRolloverBudget,
  categoriesDecoratedWithExpenses,
  openCategory,
  createModalExpense,
  updateModalExpense,
  onSetOpenCategory,
  onSetCreateModalExpense,
  onSetUpdateModalExpense,
  refetchExpenses,
}) => {
  const noDataAvailable =
    totalSubcategories === 0 || !categoriesDecoratedWithExpenses;
  const dataAvailable =
    totalSubcategories > 0 && categoriesDecoratedWithExpenses;

  return (
    <div>
      {loading && <ListLoading height={24} itemCount={3} showDetails />}
      {!loading && noDataAvailable && <ExpensesListNoData />}
      {!loading && dataAvailable && (
        <ExpensesListData
          pageDate={pageDate}
          showRolloverBudget={showRolloverBudget}
          categoriesDecoratedWithExpenses={categoriesDecoratedWithExpenses}
          openCategory={openCategory}
          createModalExpense={createModalExpense}
          updateModalExpense={updateModalExpense}
          setOpenCategory={onSetOpenCategory}
          setCreateModalExpense={onSetCreateModalExpense}
          setUpdateModalExpense={onSetUpdateModalExpense}
          refetchExpenses={refetchExpenses}
        />
      )}
    </div>
  );
};
