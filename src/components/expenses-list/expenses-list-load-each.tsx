import { useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import { format } from "date-fns";
import Select from "react-select";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  CategoriesListQuery,
  Expense,
  useCreateExpenseMutation,
} from "../../generated/graphql";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { GET_CATEGORY } from "./expenses-list-queries";
import { LoadingInlineSpinner } from "../loading-inline-spinner/loading-inline-spinner";
import { ActionsBar } from "../actions-bar/actions-bar";

interface Props {
  data: CategoriesListQuery;
  currentDate: Date;
  refetchCategories: any;
}

export const ExpensesListLoadEach: React.FC<Props> = ({
  data,
  refetchCategories,
  currentDate,
}) => {
  const [openCategory, setOpenCategory] = useState("");
  const [openSubcategory, setOpenSubcategory] = useState("");
  const [addExpenseField, setAddExpenseField] = useState(false);
  const [newExpenseAmount, setExpenseAmount] = useState("");
  const [newExpenseDate, setExpenseDate] = useState("");
  const [newExpenseSubcategoryId, setExpenseSubcategoryId] = useState("");
  const [pageDate, setPageDate] = useState(currentDate);

  const [
    getCategory,
    { data: categoryData, refetch: refetchCategory, loading: loadingCategory },
  ] = useLazyQuery(GET_CATEGORY);

  const [createExpense, { loading: loadingCreateExpense }] =
    useCreateExpenseMutation({
      variables: {
        subcategoryId: newExpenseSubcategoryId,
        amount: Number(newExpenseAmount),
        date: String(newExpenseDate),
      },
      onCompleted: ({ createExpense }) => {
        refetchCategory();
        setAddExpenseField(false);
        setExpenseAmount("");
        setExpenseDate("");
        setExpenseSubcategoryId("");
        toast.success(`You have successfully created a new expense!`);
      },
    });

  console.log({ categoryData });
  console.log({ currentDate });
  console.log({ pageDate });

  return (
    <div>
      <ActionsBar
        displayDate={pageDate}
        onClickPrevious={() => {
          const previousDate = new Date(
            pageDate.getFullYear(),
            pageDate.getMonth() - 1,
            pageDate.getDate()
          );

          setPageDate(previousDate);
          setOpenCategory("");
        }}
        onClickNext={() => {
          const nextDate = new Date(
            pageDate.getFullYear(),
            pageDate.getMonth() + 1,
            pageDate.getDate()
          );
          setPageDate(nextDate);
          setOpenCategory("");
        }}
      />
      {!!data.categories &&
        data.categories.map((category, key) => {
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
                      getCategory({
                        variables: {
                          id: categoryId,
                          date: pageDate,
                        },
                      });
                    }
                  }}
                >
                  {showSubcategories ? (
                    <span className="iconContainer prominent">
                      <ExpandMoreIcon />
                      {category.name}
                      {loadingCategory && <LoadingInlineSpinner />}
                    </span>
                  ) : (
                    <span className="iconContainer">
                      <ChevronRightIcon />
                      {category.name}
                    </span>
                  )}
                </div>
              </div>
              {showSubcategories && (
                <>
                  {!!categoryData?.category?.subcategories &&
                    categoryData?.category?.subcategories.map(
                      (subcategory: any, subcategoryKey: string) => {
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

                        console.log({ subcategory });
                        console.log({ totalSubcategoryExpenses });

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
                                    {expensesExist && <ExpandMoreIcon />}
                                    {subcategory.name}
                                  </span>
                                ) : (
                                  <span className="iconContainer">
                                    {expensesExist && <ChevronRightIcon />}
                                    {subcategory.name}
                                  </span>
                                )}
                              </div>
                              <span className="budgetAmount orange">
                                {subcategory.budgetAmount} €
                              </span>
                              {expensesExist && (
                                <span className="expenseAmount red">
                                  {totalSubcategoryExpenses} €
                                </span>
                              )}
                            </div>
                            {showExpenses && (
                              <>
                                {!!categoryData?.category?.subcategories[
                                  subcategoryKey
                                ] &&
                                  categoryData?.category?.subcategories[
                                    subcategoryKey
                                  ].expenses.map(
                                    (expense: Expense, expenseKey: string) => {
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
                                              <span className="expenseField expenseAmount red">
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
                          onChange={(e) => setExpenseDate(e.target.value)}
                        />
                        <Select
                          className="customReactSelectInput"
                          onChange={(selectedOption: any) => {
                            console.log({ selectedOption });
                            setExpenseSubcategoryId(selectedOption.value);
                          }}
                          options={
                            !!categoryData?.category?.subcategories &&
                            categoryData?.category?.subcategories.map(
                              (subcategory: any) => {
                                if (!subcategory) return null;
                                return {
                                  value: subcategory.id,
                                  label: subcategory.name,
                                };
                              }
                            )
                          }
                        />
                        <button
                          className="btnCancel red"
                          onClick={() => setAddExpenseField(false)}
                        >
                          Cancel
                        </button>
                        <button onClick={() => createExpense()}>
                          {loadingCreateExpense ? "saving..." : "Add"}
                        </button>
                      </div>
                    )}
                    {!addExpenseField && (
                      <div
                        className="listItem category add"
                        onClick={() => setAddExpenseField(true)}
                      >
                        <AddCircleRoundedIcon />
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
