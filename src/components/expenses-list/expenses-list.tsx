import React, { useState } from "react";
import { format } from "date-fns";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Category,
  Subcategory,
  Expense,
  useDeleteExpenseMutation,
} from "../../generated/graphql";
import { ProgressBar } from "../progress-bar/progress-bar";
import { AddFormContainer } from "../../shared";
import { CreateExpenseForm } from "../create-expense-form/create-expense-form";
import { AnchorActionDropdownElProps } from "../categories-list/categories-list";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

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
  const [anchorActionDropdownEl, setAnchorActionDropdownEl] =
    React.useState<AnchorActionDropdownElProps>({});

  const [openCategory, setOpenCategory] = useState("");
  const [openSubcategory, setOpenSubcategory] = useState("");
  const [expenseFormVisible, setExpenseFormVisible] = useState(false);

  const [deleteExpense] = useDeleteExpenseMutation({
    onError: () => {
      toast.error(`Error while deleting an expense! Please try again.`);
    },
    onCompleted: ({ deleteExpense }) => {
      refetchExpenses();
      toast.success(
        `You have successfully removed ${deleteExpense.id} expense!`
      );
    },
  });

  const handleActionsDropdownClick = (
    event: React.MouseEvent<HTMLElement>,
    anchorIndex: string
  ) => {
    setAnchorActionDropdownEl({
      ...anchorActionDropdownEl,
      [anchorIndex]: event.currentTarget,
    });
  };

  const handleActionsDropdownClose = (anchorIndex: string) => {
    setAnchorActionDropdownEl({
      ...anchorActionDropdownEl,
      [anchorIndex]: null,
    });
  };

  return (
    <div>
      {!!data &&
        data?.map((category: CategoryDecoratedWithExpenses) => {
          if (!category) return null;

          const categoryId = category.id;
          const showSubcategories = openCategory === categoryId;

          const availableSubcategories = category.subcategories.length > 0;

          return (
            <React.Fragment key={categoryId}>
              <div className="listItem category">
                <div
                  className="categoryTitle"
                  onClick={() => {
                    if (showSubcategories) {
                      setOpenCategory("");
                    } else {
                      setOpenCategory(categoryId);
                    }
                  }}
                >
                  {showSubcategories ? (
                    <span className="iconContainer prominent">
                      <ExpandMoreIcon />
                      {category.name}
                    </span>
                  ) : (
                    <span className="iconContainer">
                      {availableSubcategories && <ChevronRightIcon />}
                      {category.name}
                    </span>
                  )}
                </div>
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

                        return (
                          <span key={subcategoryId}>
                            <div className="listItem subcategory">
                              <div
                                className="categoryTitle"
                                onClick={() => {
                                  if (expensesExist) {
                                    if (showExpenses) {
                                      setOpenSubcategory("");
                                    } else {
                                      setOpenSubcategory(subcategoryId);
                                    }
                                  }
                                }}
                              >
                                {showExpenses ? (
                                  <>
                                    <span className="iconContainer prominent">
                                      {expensesExist && <ExpandMoreIcon />}
                                      {subcategory.name}
                                    </span>
                                    <ProgressBar
                                      value={totalSubcategoryExpenses}
                                      maxValue={budgetValue}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <span className="iconContainer">
                                      {expensesExist && <ChevronRightIcon />}
                                      {subcategory.name}
                                    </span>
                                    <ProgressBar
                                      value={totalSubcategoryExpenses}
                                      maxValue={budgetValue}
                                    />
                                  </>
                                )}
                              </div>
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
                            </div>
                            {showExpenses && (
                              <>
                                {!!category?.subcategories[subcategoryKey] &&
                                  category?.subcategories[
                                    subcategoryKey
                                  ].expenses!.map((expense: Expense) => {
                                    if (!expense) return null;

                                    const expenseId = expense.id;
                                    const expenseISODate = Number(expense.date);

                                    return (
                                      <span key={expenseId}>
                                        <div className="listItem expense">
                                          <div className="expenseFields">
                                            <span className="expenseField expenseDate">
                                              {subcategory.name} -{" "}
                                              {format(expenseISODate, "dd MMM")}{" "}
                                              - {expense.amount} €
                                            </span>
                                          </div>
                                          <div className="actions">
                                            <div>
                                              <IconButton
                                                id={`long-menu-icon-${expenseId}`}
                                                aria-haspopup="true"
                                                size="small"
                                                onClick={(event) =>
                                                  handleActionsDropdownClick(
                                                    event,
                                                    expenseId
                                                  )
                                                }
                                              >
                                                <MoreVertIcon />
                                              </IconButton>
                                              <Menu
                                                id={`long-menu-${expenseId}`}
                                                anchorEl={
                                                  anchorActionDropdownEl[
                                                    expenseId
                                                  ]
                                                }
                                                open={Boolean(
                                                  anchorActionDropdownEl[
                                                    expenseId
                                                  ]
                                                )}
                                                onClose={() =>
                                                  handleActionsDropdownClose(
                                                    expenseId
                                                  )
                                                }
                                              >
                                                <MenuItem
                                                  disabled
                                                  onClick={() =>
                                                    handleActionsDropdownClose(
                                                      expenseId
                                                    )
                                                  }
                                                >
                                                  Edit
                                                </MenuItem>
                                                <MenuItem
                                                  onClick={() => {
                                                    deleteExpense({
                                                      variables: {
                                                        id: expenseId,
                                                      },
                                                    });
                                                    handleActionsDropdownClose(
                                                      expenseId
                                                    );
                                                  }}
                                                >
                                                  Remove
                                                </MenuItem>
                                              </Menu>
                                            </div>
                                          </div>
                                        </div>
                                      </span>
                                    );
                                  })}
                              </>
                            )}
                          </span>
                        );
                      }
                    )}
                  <>
                    {expenseFormVisible && (
                      <AddFormContainer>
                        <CreateExpenseForm
                          subcategories={category?.subcategories}
                          currentDate={currentDate}
                          refetchExpenses={refetchExpenses}
                          closeForm={() => setExpenseFormVisible(false)}
                        />
                      </AddFormContainer>
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
