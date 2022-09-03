import { gql } from "@apollo/client";
import React, { useState } from "react";
import {
  CategoryListQuery,
  useCreateCategoryMutation,
} from "../../generated/graphql";

interface Props {
  data: CategoryListQuery;
}

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) {
      name
    }
  }
`;

export const CategoriesList: React.FC<Props> = ({ data }) => {
  const [addCategoryField, setAddCategoryField] = useState(false);
  const [newCategoryName, setCategoryName] = useState("");
  const [createCategory, { data: createCategoryData, loading, error }] =
    useCreateCategoryMutation({
      variables: {
        name: newCategoryName,
      },
      onCompleted: ({ createCategory }) => {
        setAddCategoryField(false);
        setCategoryName("");
      },
    });

  return (
    <>
      <div className="listContainer">
        {!!data.categories &&
          data.categories.map(
            (category, key) =>
              !!category && (
                <div key={key} className="listItem">
                  {category.name}
                </div>
              )
          )}
        <>
          {addCategoryField && (
            <div className="listItem">
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
              className="listItem add"
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
