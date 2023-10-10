import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Expense } from "../../generated/graphql";
import { ExpandedExpenses } from "../expanded-expenses/expanded-expenses";
import { ListItemHeader } from "../list-item-header/list-item-header";
import { getRolloverBudget } from "../../utils/getRolloverBudget";
import { ListItemDetails } from "../list-item-details/list-item-details";
import { SubcategoryDecoratedWithExpenses } from "../expenses-list/expenses-list";
import { ListItemStyled } from "../../shared";

const SubcategoryListItemStyled = styled(ListItemStyled)({
  position: "relative",
  height: "52px",
  padding: "8px 32px 8px 56px",
  fontSize: "16px",
});

interface Props {
  subcategory: SubcategoryDecoratedWithExpenses;
  subcategorySelected: SubcategoryDecoratedWithExpenses;
  currentDate: Date;
  showRolloverBudget: boolean;
  refetchExpenses: () => Promise<unknown>;
  setUpdateModalExpense: (expense: Expense) => void;
}

export const SubcategoryListItem: React.FC<Props> = ({
  subcategory,
  subcategorySelected,
  currentDate,
  showRolloverBudget,
  refetchExpenses,
  setUpdateModalExpense,
}) => {
  const [openSubcategory, setOpenSubcategory] = useState("");

  const subcategoryId = subcategory.id;
  const showExpenses = openSubcategory === subcategoryId;
  const totalSubcategoryExpenses = subcategory.expenses.reduce(
    (accumulator: number, currentValue: Expense) =>
      accumulator + currentValue.amount,
    0
  );
  const expensesExist = totalSubcategoryExpenses > 0;
  const budgetAmount = subcategory.budgetAmount || 0;
  const rolloverBudgetAmount = getRolloverBudget({
    currentDate,
    createdAt: subcategory.createdAt,
    budgetAmount,
  });
  const budgetValue = showRolloverBudget ? rolloverBudgetAmount : budgetAmount;

  return (
    <>
      <SubcategoryListItemStyled>
        <ListItemHeader
          title={subcategory.name}
          showExpand={!showExpenses && expensesExist}
          showCollapse={showExpenses && expensesExist}
          onToggleExpand={() => {
            if (expensesExist) {
              if (showExpenses) {
                setOpenSubcategory("");
              } else {
                setOpenSubcategory(subcategoryId);
              }
            }
          }}
        />
        <ListItemDetails
          expenseValue={totalSubcategoryExpenses}
          budgetValue={budgetValue}
        />
      </SubcategoryListItemStyled>
      {showExpenses && (
        <>
          {!!subcategorySelected && (
            <ExpandedExpenses
              expenses={subcategorySelected.expenses}
              setUpdateModalExpense={setUpdateModalExpense}
              subcategoryName={subcategory.name}
              refetchExpenses={refetchExpenses}
            />
          )}
        </>
      )}
    </>
  );
};
