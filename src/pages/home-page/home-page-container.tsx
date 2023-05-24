import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import Select from "react-select";
import { GET_CATEGORIES_LIST } from "../../components/categories-list/categories-list-queries";
import {
  Category,
  Expense,
  useCreateExpenseMutation,
} from "../../generated/graphql";
import { LoadingScreen } from "../../components/loading-screen/loading-screen";
import { HomePage } from "../../components/home-page/home-page";
import { GET_EXPENSES_LIST } from "../../components/expenses-list/expenses-list-queries";
import { ActionsBar } from "../../components/actions-bar/actions-bar";
import { toast } from "react-toastify";

export const HomePageContainer = () => {
  const currentDate = new Date();
  const [pageDate, setPageDate] = useState(currentDate);
  const [expenseFormOpen, toggleExpenseFormOpen] = useState(false);
  const [newExpenseAmount, setExpenseAmount] = useState("");
  const [newExpenseDate, setExpenseDate] = useState("");
  const [newExpenseSubcategoryId, setExpenseSubcategoryId] = useState("");

  const [createExpense, { loading: loadingCreateExpense }] =
    useCreateExpenseMutation({
      variables: {
        subcategoryId: newExpenseSubcategoryId,
        amount: Number(newExpenseAmount),
        date: String(newExpenseDate),
      },
      onCompleted: ({ createExpense }) => {
        toggleExpenseFormOpen(false);
        setExpenseAmount("");
        setExpenseDate("");
        setExpenseSubcategoryId("");
        toast.success(`You have successfully created a new expense!`);
      },
    });

  console.log({ expenseFormOpen });

  const { data: expensesData, loading: loadingExpenses } = useQuery(
    GET_EXPENSES_LIST,
    {
      variables: {
        date: pageDate,
      },
    }
  );
  const { data: categoriesData, loading: loadingCategories } =
    useQuery(GET_CATEGORIES_LIST);

  const totalExpensesAmount = expensesData?.expenses.reduce(
    (accumulator: number, currentValue: Expense) =>
      accumulator + currentValue.amount,
    0
  );

  const totalBudgetAmount = categoriesData?.categories
    ?.map((category: Category) => {
      const totalSubcategoryExpenses = category?.subcategories?.reduce(
        (accumulator: number, currentValue: any) =>
          accumulator + currentValue.budgetAmount,
        0
      );

      return totalSubcategoryExpenses;
    })
    .reduce(
      (accumulator: number, currentValue: number) => accumulator + currentValue,
      0
    );

  return (
    <>
      <ActionsBar
        displayDate={pageDate}
        onClickPrevious={() => {
          const previousDate = new Date(
            pageDate.getFullYear(),
            pageDate.getMonth() - 1,
            pageDate.getDate()
          );

          setPageDate(previousDate);
        }}
        onClickNext={() => {
          const nextDate = new Date(
            pageDate.getFullYear(),
            pageDate.getMonth() + 1,
            pageDate.getDate()
          );
          setPageDate(nextDate);
        }}
      />
      {/* <div
        className="action"
        onClick={() => toggleExpenseFormOpen(!expenseFormOpen)}
      >
        Add expense
      </div> */}
      {expenseFormOpen && (
        <div>
          <div className="listItem addField">
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
                // setExpenseSubcategoryId(selectedOption.value);
              }}
              // options={
              //   !!category?.subcategories! &&
              //   category?.subcategories.map((subcategory: any) => {
              //     if (!subcategory) return null;
              //     return {
              //       value: subcategory.id,
              //       label: subcategory.name,
              //     };
              //   })
              // }
            />
            <button
              className="btnCancel red"
              onClick={() => toggleExpenseFormOpen(false)}
            >
              Cancel
            </button>
            <button
              onClick={() =>
                toast.success(`You have successfully created a new expense!`)
              }
            >
              {/* <button onClick={() => createExpense()}> */}
              {loadingCreateExpense ? "saving..." : "Add"}
            </button>
          </div>
        </div>
      )}
      {loadingExpenses || loadingCategories ? (
        <LoadingScreen />
      ) : (
        <HomePage
          totalExpensesAmount={totalExpensesAmount}
          totalBudgetAmount={totalBudgetAmount}
        />
      )}
    </>
  );
};
