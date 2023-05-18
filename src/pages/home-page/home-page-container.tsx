import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { GET_CATEGORIES_LIST } from "../../components/categories-list/categories-list-queries";
import { Category, Expense } from "../../generated/graphql";
import { LoadingScreen } from "../../components/loading-screen/loading-screen";
import { HomePage } from "../../components/home-page/home-page";
import { GET_EXPENSES_LIST } from "../../components/expenses-list/expenses-list-queries";
import { Filter } from "../../components/filter/filter";

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
      <Filter
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
