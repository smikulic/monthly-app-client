import React, { useState } from "react";
import * as Sentry from "@sentry/react";
import { Category, Expense, Maybe, Subcategory } from "../../generated/graphql";
import {
  ExpensesList,
  CategoryDecoratedWithExpenses,
} from "../../components/expenses-list/expenses-list";
import { useQuery } from "@apollo/client";
import { LoadingScreen } from "../../components/loading-screen/loading-screen";
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

  let totalSubcategories = 0;
  const categoriesDecoratedWithExpenses: CategoryDecoratedWithExpenses[] =
    categoriesData?.categories.map((category: Category) => {
      let totalExpenseAmount = 0;
      const subcategoriesDecoratedWithExpense = category?.subcategories!.map(
        (subcategory: Maybe<Subcategory>) => {
          totalSubcategories += 1;

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
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
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
        showRollover={showRolloverBudget}
        toggleRollover={() => setShowRolloverBudget(!showRolloverBudget)}
      />
      {loadingExpenses || loadingCategories ? (
        <LoadingScreen />
      ) : (
        <ExpensesList
          data={categoriesDecoratedWithExpenses}
          totalSubcategories={totalSubcategories}
          refetchExpenses={refetchExpenses}
          currentDate={currentDate}
          showRolloverBudget={showRolloverBudget}
        />
      )}
    </Sentry.ErrorBoundary>
  );
};
