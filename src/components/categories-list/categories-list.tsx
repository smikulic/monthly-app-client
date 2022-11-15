import { gql } from "@apollo/client";
import React, { useState } from "react";
import {
  CategoriesListQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../generated/graphql";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

interface Props {
  data: CategoriesListQuery;
  refetchCategories: any;
}

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) {
      name
    }
  }
`;

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
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

  const [createCategory, { loading }] = useCreateCategoryMutation({
    variables: {
      name: newCategoryName,
    },
    onCompleted: ({ createCategory }) => {
      setAddCategoryField(false);
      setCategoryName("");
      toast.success(
        `You have successfully created ${createCategory.name} category!`
      );
      refetchCategories();
    },
  });

  const [deleteCategory, { loading: loadingDeleteCategory }] =
    useDeleteCategoryMutation({
      onCompleted: ({ deleteCategory }) => {
        toast.success(
          `You have successfully removed ${deleteCategory.name} category!`
        );
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
                  <span
                    className="remove red"
                    onClick={() =>
                      deleteCategory({ variables: { id: category.id } })
                    }
                  >
                    {loadingDeleteCategory ? "removing..." : "Remove"}
                  </span>
                </div>
              )
          )}
        <>
          {addCategoryField && (
            <div className="listItem category addField">
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
