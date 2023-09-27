import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import Select from "react-select";
import {
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiPlusCircle,
} from "react-icons/hi";
import {
  Category,
  Expense,
  useCreateExpenseMutation,
} from "../../generated/graphql";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Subcategory } from "../../generated/graphql";
import { ProgressBar } from "../progress-bar/progress-bar";

export interface SubcategoryDecoratedWithExpenses extends Subcategory {
  expenses: Expense[];
}

export interface CategoryDecoratedWithExpenses extends Category {
  totalExpenseAmount: number;
  subcategories: SubcategoryDecoratedWithExpenses[];
}

interface Props {
  data: CategoryDecoratedWithExpenses[];
  refetchExpenses: () => void;
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
  const [addExpenseField, setAddExpenseField] = useState(false);
  const [newExpenseAmount, setExpenseAmount] = useState("");
  const [newExpenseDate, setExpenseDate] = useState(
    currentDate.toISOString().split("T")[0]
  );
  const [newExpenseSubcategoryId, setExpenseSubcategoryId] = useState("");
  const [formInvalid, setFormInvalid] = useState(true);

  useEffect(() => {
    if (!newExpenseAmount || !newExpenseDate || !newExpenseSubcategoryId) {
      setFormInvalid(true);
    } else {
      setFormInvalid(false);
    }
  }, [newExpenseAmount, newExpenseDate, newExpenseSubcategoryId]);

  const [createExpense, { loading: loadingCreateExpense }] =
    useCreateExpenseMutation({
      variables: {
        subcategoryId: newExpenseSubcategoryId,
        amount: Number(newExpenseAmount),
        date: String(newExpenseDate),
      },
      onCompleted: ({ createExpense }) => {
        refetchExpenses();
        setAddExpenseField(false);
        setExpenseAmount("");
        setExpenseDate("");
        setExpenseSubcategoryId("");
        toast.success(`You have successfully created a new expense!`);
      },
    });

  return (
    <div>
      {!!data &&
        data?.map((category: CategoryDecoratedWithExpenses, key: number) => {
          if (!category) return null;
          const categoryId = category.id;
          const showSubcategories = openCategory === categoryId;

          return (
            <span key={key}>
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
                      <HiOutlineChevronDown />
                      {category.name}
                    </span>
                  ) : (
                    <span className="iconContainer">
                      <HiOutlineChevronRight />
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

                        const createdAt = new Date(subcategory.createdAt);

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
                          <span key={subcategoryKey}>
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
                                  <span className="iconContainer prominent">
                                    {expensesExist && <HiOutlineChevronDown />}
                                    {subcategory.name}
                                    <ProgressBar
                                      value={totalSubcategoryExpenses}
                                      maxValue={budgetValue}
                                    />
                                  </span>
                                ) : (
                                  <span className="iconContainer">
                                    {expensesExist && <HiOutlineChevronRight />}
                                    {subcategory.name}
                                    <ProgressBar
                                      value={totalSubcategoryExpenses}
                                      maxValue={budgetValue}
                                    />
                                  </span>
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
                                  ].expenses!.map(
                                    (expense: Expense, expenseKey: number) => {
                                      if (!expense) return null;
                                      const expenseISODate = Number(
                                        expense.date
                                      );

                                      return (
                                        <span key={expenseKey}>
                                          <div className="listItem expense">
                                            <div className="expenseFields">
                                              <span className="expenseField expenseDate">
                                                {format(
                                                  expenseISODate,
                                                  "dd MMM"
                                                )}
                                              </span>
                                              <span className="expenseField expenseAmount">
                                                {expense.amount} €
                                              </span>
                                            </div>
                                          </div>
                                        </span>
                                      );
                                    }
                                  )}
                              </>
                            )}
                          </span>
                        );
                      }
                    )}
                  <>
                    {addExpenseField && (
                      <div className="listItem category addField">
                        <input
                          type="text"
                          placeholder="Amount"
                          onChange={(e) => setExpenseAmount(e.target.value)}
                        />
                        <input
                          type="date"
                          placeholder="Date"
                          defaultValue={currentDate.toISOString().split("T")[0]}
                          onChange={(e) => setExpenseDate(e.target.value)}
                        />
                        <Select
                          className="customReactSelectInput"
                          onChange={(selectedOption: any) => {
                            setExpenseSubcategoryId(selectedOption.value);
                          }}
                          options={
                            !!category?.subcategories! &&
                            category?.subcategories.map(
                              (subcategory: Subcategory) => {
                                if (!subcategory) return null;
                                return {
                                  value: subcategory.id,
                                  label: subcategory.name,
                                };
                              }
                            )
                          }
                        />
                        <div className="buttonsGroup">
                          <button
                            className="btnCancel red"
                            onClick={() => setAddExpenseField(false)}
                          >
                            Cancel
                          </button>
                          <button
                            disabled={formInvalid}
                            onClick={() => createExpense()}
                          >
                            {loadingCreateExpense ? "saving..." : "Add"}
                          </button>
                        </div>
                      </div>
                    )}
                    {!addExpenseField && (
                      <div
                        className="listItem category add"
                        onClick={() => setAddExpenseField(true)}
                      >
                        <HiPlusCircle />
                        Add expense
                      </div>
                    )}
                  </>
                </>
              )}
            </span>
          );
        })}
    </div>
  );
};
