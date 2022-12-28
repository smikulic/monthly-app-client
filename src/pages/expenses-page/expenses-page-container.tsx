import * as React from "react";
import { useCategoriesListQuery } from "../../generated/graphql";
import { ExpensesList } from "../../components/expenses-list/expenses-list";
import { gql } from "@apollo/client";
import { LoadingScreen } from "../../components/loading-screen/loading-screen";

export const GET_EXPENSES_CATEGORIES_LIST = gql`
  query CategoriesList {
    categories {
      id
      name
    }
  }
`;

export const ExpensesPageContainer = () => {
  const {
    data,
    error,
    loading,
    refetch: refetchCategories,
  } = useCategoriesListQuery();

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !data) {
    return <div>ERROR</div>;
  }

  return <ExpensesList data={data} refetchCategories={refetchCategories} />;
};
