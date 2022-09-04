import * as React from "react";
import { useCategoryListQuery } from "../../generated/graphql";
import { CategoriesList } from "../../components/categories-list/categories-list";

export const ExpensesPageContainer = () => {
  const {
    data,
    error,
    loading,
    refetch: refetchCategories,
  } = useCategoryListQuery();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>ERROR</div>;
  }

  return <CategoriesList data={data} refetchCategories={refetchCategories} />;
};
