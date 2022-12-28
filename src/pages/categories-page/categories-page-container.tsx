import * as React from "react";
import { useCategoriesListQuery } from "../../generated/graphql";
import { CategoriesList } from "../../components/categories-list/categories-list";
import { gql } from "@apollo/client";
import { LoadingScreen } from "../../components/loading-screen/loading-screen";

export const GET_CATEGORIES_LIST = gql`
  query CategoriesList {
    categories {
      id
      name
      subcategories {
        id
        name
        budgetAmount
      }
    }
  }
`;

export const CategoriesPageContainer = () => {
  const {
    data,
    error,
    loading,
    refetch: refetchCategories,
  } = useCategoriesListQuery({
    notifyOnNetworkStatusChange: true,
  });

  if (!data && loading) {
    return <LoadingScreen />;
  }

  if (error || !data) {
    return <div>ERROR</div>;
  }

  return (
    <CategoriesList
      data={data}
      loading={loading}
      refetchCategories={refetchCategories}
    />
  );
};
