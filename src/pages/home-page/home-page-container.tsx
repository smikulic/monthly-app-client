import * as React from "react";
import { useCategoryListQuery } from "../../generated/graphql";
import { CategoriesList } from "../../components/categories-list/categories-list";

export const CategoriesListContainer = () => {
  const { data, error, loading } = useCategoryListQuery();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>ERROR</div>;
  }

  return <CategoriesList data={data} />;
};
