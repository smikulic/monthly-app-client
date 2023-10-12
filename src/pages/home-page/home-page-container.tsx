import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import * as Sentry from "@sentry/react";
import { GET_CATEGORIES_LIST } from "../../components/categories-list/categories-list-queries";
import { Category, Expense } from "../../generated/graphql";
import { LoadingScreen } from "../../components/loading-screen/loading-screen";
import { HomePage } from "../../components/home-page/home-page";
import {
  GET_CHART_EXPENSES_LIST,
  GET_EXPENSES_LIST,
} from "../../components/expenses-list/expenses-list-queries";
import { ActionsBar } from "../../components/actions-bar/actions-bar";

export const HomePageContainer = () => {
  const currentDate = new Date();
  const [pageDate, setPageDate] = useState(currentDate);

  const { data: expensesData, loading: loadingExpenses } = useQuery(
    GET_EXPENSES_LIST,
    {
      variables: {
        date: pageDate,
      },
    }
  );

  const { data: chartExpensesData, loading: loadingChartExpenses } = useQuery(
    GET_CHART_EXPENSES_LIST,
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
      />
      {loadingExpenses || loadingChartExpenses || loadingCategories ? (
        <LoadingScreen />
      ) : (
        <HomePage
          totalExpensesAmount={totalExpensesAmount}
          totalBudgetAmount={totalBudgetAmount}
          chartExpensesData={chartExpensesData.chartExpenses}
          pageDate={pageDate}
        />
      )}
    </Sentry.ErrorBoundary>
  );
};
