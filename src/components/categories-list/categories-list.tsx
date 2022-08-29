import * as React from "react";
import { CategoryListQuery } from "../../generated/graphql";

interface Props {
  data: CategoryListQuery;
}

export const CategoriesList: React.FC<Props> = ({ data }) => {
  return (
    <>
      <div className="listContainer">
        {!data.categories.length && (
          <div className="listItem">Add category &#43;</div>
        )}
        {!!data.categories &&
          data.categories.map(
            (category, key) =>
              !!category && <li key={key}>ha !{category.name})</li>
          )}
      </div>
    </>
  );
};
