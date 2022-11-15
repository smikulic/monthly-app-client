import { gql, useLazyQuery } from "@apollo/client";
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

export const GET_CATEGORY = gql`
  query Category($id: ID!) {
    category(id: $id) {
      id
      name
      subcategories {
        name
      }
    }
  }
`;

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
  const [openCategory, setOpenCategory] = useState("");

  const [getCategory, { data: categoryData }] = useLazyQuery(GET_CATEGORY);

  console.log({ categoryData });

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
          data.categories.map((category, key) => {
            if (!category) return null;
            const categoryId = category.id;
            const showSubcategories = openCategory === categoryId;
            const subcategoriesExist =
              categoryData?.category?.subcategories.length > 0;

            return (
              <span key={key}>
                <div className="listItem category">
                  <div
                    className="subcategories"
                    onClick={() => {
                      if (showSubcategories) {
                        setOpenCategory("");
                      } else {
                        setOpenCategory(categoryId);
                        getCategory({ variables: { id: categoryId } });
                      }
                    }}
                  >
                    {showSubcategories ? (
                      <>{category.name} &uarr;</>
                    ) : (
                      <>{category.name} &darr;</>
                    )}
                  </div>

                  <span
                    className="remove red"
                    onClick={() =>
                      deleteCategory({ variables: { id: categoryId } })
                    }
                  >
                    {loadingDeleteCategory ? "removing..." : "Remove"}
                  </span>
                </div>
                {showSubcategories && !subcategoriesExist && (
                  <div>No subcategories!</div>
                )}
                {showSubcategories && subcategoriesExist && (
                  <div>Subcategories!!</div>
                )}
              </span>
            );
          })}
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
