import { gql } from "@apollo/client";
import React, { useState } from "react";
import {
  CategoryListQuery,
  useCreateCategoryMutation,
} from "../../generated/graphql";

interface Props {
  data: CategoryListQuery;
  refetchCategories: any;
}

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) {
      name
    }
  }
`;

export const CategoriesList: React.FC<Props> = ({
  data,
  refetchCategories,
}) => {
  const [addCategoryField, setAddCategoryField] = useState(false);
  const [newCategoryName, setCategoryName] = useState("");
  const [createCategory, { data: createCategoryData, loading }] =
    useCreateCategoryMutation({
      variables: {
        name: newCategoryName,
      },
      onCompleted: ({ createCategory }) => {
        setAddCategoryField(false);
        setCategoryName("");
        refetchCategories();
      },
    });

  return (
    <>
      <div className="listContainer">
        {!!data.categories &&
          data.categories.map(
            (category, key) =>
              !!category && (
                <div key={key} className="listItem category">
                  {category.name}
                </div>
              )
          )}
        <>
          {addCategoryField && (
            <div className="listItem category">
              <input
                type="text"
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <button onClick={() => createCategory()}>
                {loading ? "saving..." : "Add"}
              </button>
            </div>
          )}
          {!addCategoryField && (
            <div
              className="listItem category add"
              onClick={() => setAddCategoryField(true)}
            >
              Add category &#43;
            </div>
          )}
        </>
      </div>
    </>
  );
};
