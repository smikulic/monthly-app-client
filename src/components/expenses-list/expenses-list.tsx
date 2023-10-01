import React, { useState } from "react";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { Category, Subcategory, Expense } from "../../generated/graphql";
import { ProgressBar } from "../progress-bar/progress-bar";
import { AddFormStyled } from "../../shared";
import { CreateExpenseForm } from "../create-expense-form/create-expense-form";
import { ExpandedExpenses } from "../expanded-expenses/expanded-expenses";
import { ListItemHeader } from "../list-item-header/list-item-header";

export interface SubcategoryDecoratedWithExpenses extends Subcategory {
  expenses: Expense[];
}

export interface CategoryDecoratedWithExpenses extends Category {
  totalExpenseAmount: number;
  subcategories: SubcategoryDecoratedWithExpenses[];
}

interface Props {
  data: CategoryDecoratedWithExpenses[];
  refetchExpenses: () => Promise<unknown>;
  currentDate: Date;
  showRolloverBudget: boolean;
}

export const ExpensesList: React.FC<Props> = ({
  data,
  refetchExpenses,
  currentDate,
  showRolloverBudget,
}) => {
  const [openCategory, setOpenCategory] = useState("");
  const [openSubcategory, setOpenSubcategory] = useState("");
  const [expenseFormVisible, setExpenseFormVisible] = useState(false);

  return (
    <div>
      {!!data &&
        data?.map((category: CategoryDecoratedWithExpenses) => {
          if (!category) return null;

          const categoryId = category.id;
          const showSubcategories = openCategory === categoryId;

          const subcategoriesExist = category.subcategories.length > 0;

          return (
            <React.Fragment key={categoryId}>
              <div className="listItem category">
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
                  <span className="expenseAmount">
                    {category.totalExpenseAmount} €
                  </span>
                )}
              </div>
              {showSubcategories && (
                <>
                  {!!category?.subcategories &&
                    category?.subcategories.map(
                      (
                        subcategory: SubcategoryDecoratedWithExpenses,
                        subcategoryKey: number
                      ) => {
                        if (!subcategory) return null;

                        const subcategoryId = subcategory.id;
                        const showExpenses = openSubcategory === subcategoryId;
                        const totalSubcategoryExpenses =
                          subcategory.expenses.reduce(
                            (accumulator: number, currentValue: Expense) =>
                              accumulator + currentValue.amount,
                            0
                          );
                        const expensesExist = totalSubcategoryExpenses > 0;
                        const budgetAmount = subcategory.budgetAmount || 0;

                        const createdAt = new Date(
                          Number(subcategory.createdAt)
                        );

                        const monthsPassed = Math.floor(
                          (currentDate.getFullYear() -
                            createdAt.getFullYear()) *
                            12 +
                            currentDate.getMonth() -
                            createdAt.getMonth()
                        );

                        const rolloverBudget =
                          monthsPassed * budgetAmount + budgetAmount;

                        const budgetValue = showRolloverBudget
                          ? rolloverBudget
                          : budgetAmount;

                        const budgetExpenseDifference =
                          budgetValue - totalSubcategoryExpenses;

                        const subcategorySelected =
                          category?.subcategories[subcategoryKey];

                        return (
                          <span key={subcategoryId}>
                            <div className="listItem subcategory">
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
                              <span
                                className={
                                  budgetExpenseDifference > 0
                                    ? "budgetAmount green"
                                    : "budgetAmount red"
                                }
                              >
                                {budgetExpenseDifference} €
                              </span>
                              {expensesExist && (
                                <span className="expenseAmount">
                                  {totalSubcategoryExpenses} €
                                </span>
                              )}
                              <ProgressBar
                                value={totalSubcategoryExpenses}
                                maxValue={budgetValue}
                              />
                            </div>
                            {showExpenses && (
                              <>
                                {!!subcategorySelected && (
                                  <ExpandedExpenses
                                    expenses={subcategorySelected.expenses}
                                    subcategoryName={subcategory.name}
                                    refetchExpenses={refetchExpenses}
                                  />
                                )}
                              </>
                            )}
                          </span>
                        );
                      }
                    )}
                  <>
                    {expenseFormVisible && (
                      <AddFormStyled>
                        <CreateExpenseForm
                          subcategories={category?.subcategories}
                          currentDate={currentDate}
                          refetchExpenses={refetchExpenses}
                          closeForm={() => setExpenseFormVisible(false)}
                        />
                      </AddFormStyled>
                    )}
                    {!expenseFormVisible && (
                      <div
                        className="listItem subcategory add"
                        onClick={() => setExpenseFormVisible(true)}
                      >
                        <AddCircleRoundedIcon />
                        Add expense
                      </div>
                    )}
                  </>
                </>
              )}
            </React.Fragment>
          );
        })}
    </div>
  );
};
