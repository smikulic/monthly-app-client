import { useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import { format } from "date-fns";
import Select from "react-select";
import {
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiOutlineArrowCircleLeft,
  HiOutlineArrowCircleRight,
  HiPlusCircle,
} from "react-icons/hi";
import {
  CategoriesListQuery,
  useCreateExpenseMutation,
} from "../../generated/graphql";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { GET_CATEGORY } from "./expenses-list-queries";
import { LoadingInlineSpinner } from "../loading-inline-spinner/loading-inline-spinner";

interface Props {
  data: CategoriesListQuery;
  currentMonth: Date;
  refetchCategories: any;
}

export const ExpensesList: React.FC<Props> = ({
  data,
  refetchCategories,
  currentMonth,
}) => {
  const [openCategory, setOpenCategory] = useState("");
  const [openSubcategory, setOpenSubcategory] = useState("");
  const [addExpenseField, setAddExpenseField] = useState(false);
  const [newExpenseAmount, setExpenseAmount] = useState("");
  const [newExpenseDate, setExpenseDate] = useState("");
  const [newExpenseSubcategoryId, setExpenseSubcategoryId] = useState("");

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

  return (
    <div>
      <div className="monthFilter">
        <HiOutlineArrowCircleLeft
          className="filterPrev"
          onClick={() => console.log("prev month")}
        />
        {format(currentMonth, "MMM yyyy")}
        <HiOutlineArrowCircleRight
          className="filterNext"
          onClick={() => console.log("next month")}
        />
      </div>
      {!!data.categories &&
        data.categories.map((category, key) => {
          if (!category) return null;
          const categoryId = category.id;
          const showSubcategories = openCategory === categoryId;

          console.log({ categoryData });

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
                      getCategory({ variables: { id: categoryId } });
                    }
                  }}
                >
                  {showSubcategories ? (
                    <span className="iconContainer prominent">
                      <HiOutlineChevronDown />
                      {category.name}
                      {loadingCategory && <LoadingInlineSpinner />}
                    </span>
                  ) : (
                    <span className="iconContainer">
                      <HiOutlineChevronRight />
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
                        return (
                          <span key={subcategoryKey}>
                            <div className="listItem subcategory">
                              <div
                                className="categoryTitle"
                                onClick={() => {
                                  if (showExpenses) {
                                    setOpenSubcategory("");
                                  } else {
                                    setOpenSubcategory(subcategoryId);
                                  }
                                }}
                              >
                                {showExpenses ? (
                                  <span className="iconContainer prominent">
                                    <HiOutlineChevronDown />
                                    {subcategory.name}
                                  </span>
                                ) : (
                                  <span className="iconContainer">
                                    <HiOutlineChevronRight />
                                    {subcategory.name}
                                  </span>
                                )}
                              </div>
                              <span className="budgetAmount orange">
                                {subcategory.budgetAmount} ???
                              </span>
                            </div>
                            {showExpenses && (
                              <>
                                {!!categoryData?.category?.subcategories[
                                  subcategoryKey
                                ] &&
                                  categoryData?.category?.subcategories[
                                    subcategoryKey
                                  ].expenses.map(
                                    (expense: any, expenseKey: string) => {
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
                                                {expense.amount} ???
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
