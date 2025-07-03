import { useState } from "react";
import { Expense } from "@/generated/graphql";

export const useExpensesActions = () => {
  const [openCategory, setOpenCategory] = useState("");
  const [createModalExpense, setCreateModalExpense] = useState(false);
  const [updateModalExpense, setUpdateModalExpense] = useState<Expense | null>(
    null
  );

  return {
    // State
    openCategory,
    createModalExpense,
    updateModalExpense,

    // Actions
    setOpenCategory,
    setCreateModalExpense,
    setUpdateModalExpense,
  };
};
