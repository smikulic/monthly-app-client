import * as React from "react";
import { CategoryListQuery } from "../../generated/graphql";

interface Props {
  data: CategoryListQuery;
}

export const CategoriesList: React.FC<Props> = ({ data }) => (
  <div>
    <h3>Categories</h3>
    <ul>
      {!!data.categories &&
        data.categories.map(
          (category, key) =>
            !!category && <li key={key}>ha !{category.name})</li>
        )}
    </ul>
  </div>
);
