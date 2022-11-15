import * as React from "react";
import { useCategoriesListQuery } from "../../generated/graphql";
import { CategoriesList } from "../../components/categories-list/categories-list";
import { gql } from "@apollo/client";

export const GET_CATEGORIES_LIST = gql`
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
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>ERROR</div>;
  }

  return <CategoriesList data={data} refetchCategories={refetchCategories} />;
};
