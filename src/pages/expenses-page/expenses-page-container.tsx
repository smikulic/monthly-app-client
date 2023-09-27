import * as React from "react";
import Switch from "react-switch";
import { Category, Expense, Maybe, Subcategory } from "../../generated/graphql";
import {
  ExpensesList,
  CategoryDecoratedWithExpenses,
} from "../../components/expenses-list/expenses-list";
import { useQuery } from "@apollo/client";
import { LoadingScreen } from "../../components/loading-screen/loading-screen";
import { useState } from "react";
import { GET_EXPENSES_LIST } from "../../components/expenses-list/expenses-list-queries";
import { GET_CATEGORIES_LIST } from "../../components/categories-list/categories-list-queries";
import { ActionsBar } from "../../components/actions-bar/actions-bar";

export const ExpensesPageContainer = () => {
  const currentDate = new Date();
  const [pageDate, setPageDate] = useState(currentDate);
  const [showRolloverBudget, setShowRolloverBudget] = useState(true);

  const {
    data: expensesData,
    loading: loadingExpenses,
    refetch: refetchExpenses,
  } = useQuery(GET_EXPENSES_LIST, {
    variables: {
      date: pageDate,
    },
  });
  const { data: categoriesData, loading: loadingCategories } =
    useQuery(GET_CATEGORIES_LIST);

  const categoriesDecoratedWithExpenses: CategoryDecoratedWithExpenses[] =
    categoriesData?.categories.map((category: Category) => {
      let totalExpenseAmount = 0;
      const subcategoriesDecoratedWithExpense = category?.subcategories!.map(
        (subcategory: Maybe<Subcategory>) => {
          const foundExpenses = expensesData?.expenses.filter(
            (expense: Expense) => expense.subcategoryId === subcategory!.id
          );

          totalExpenseAmount = foundExpenses?.reduce(
            (accumulator: number, currentValue: Expense) =>
              accumulator + currentValue.amount,
            totalExpenseAmount
          );

          return {
            ...subcategory,
            expenses: foundExpenses,
          };
        }
      );

      return {
        ...category,
        subcategories: subcategoriesDecoratedWithExpense,
        totalExpenseAmount,
      };
    });

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
      <div className="actionsBar">
        Rollover budget
        <Switch
          onChange={() => setShowRolloverBudget(!showRolloverBudget)}
          checked={showRolloverBudget}
          onColor="#86d3ff"
          onHandleColor="#2693e6"
          handleDiameter={30}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={20}
          width={48}
          // className="react-switch"
          // id="material-switch"
        />
      </div>
      {loadingExpenses || loadingCategories ? (
        <LoadingScreen />
      ) : (
        <ExpensesList
          data={categoriesDecoratedWithExpenses}
          refetchExpenses={refetchExpenses}
          currentDate={currentDate}
          showRolloverBudget={showRolloverBudget}
        />
      )}
    </>
  );
};
