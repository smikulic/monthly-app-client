import React, { useState } from "react";
import { Category, Subcategory, Expense } from "@/generated/graphql";
import { ExpensesListLoading } from "./components/expenses-list-loading";
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
  refetchExpenses: () => Promise<unknown>;
}

export const ExpensesList: React.FC<Props> = ({
  loading,
  totalSubcategories,
  pageDate,
  showRolloverBudget,
  categoriesDecoratedWithExpenses,
  refetchExpenses,
}) => {
  const [openCategory, setOpenCategory] = useState("");
  const [createModalExpense, setCreateModalExpense] = React.useState(false);
  const [updateModalExpense, setUpdateModalExpense] =
    React.useState<Expense | null>(null);

  const noDataAvailable =
    totalSubcategories === 0 || !categoriesDecoratedWithExpenses;
  const dataAvailable =
    totalSubcategories > 0 && categoriesDecoratedWithExpenses;

  return (
    <div>
      {loading && <ExpensesListLoading />}
      {!loading && noDataAvailable && <ExpensesListNoData />}
      {!loading && dataAvailable && (
        <ExpensesListData
          pageDate={pageDate}
          showRolloverBudget={showRolloverBudget}
          categoriesDecoratedWithExpenses={categoriesDecoratedWithExpenses}
          openCategory={openCategory}
          createModalExpense={createModalExpense}
          updateModalExpense={updateModalExpense}
          setOpenCategory={setOpenCategory}
          setCreateModalExpense={setCreateModalExpense}
          setUpdateModalExpense={setUpdateModalExpense}
          refetchExpenses={refetchExpenses}
        />
      )}
    </div>
  );
};
