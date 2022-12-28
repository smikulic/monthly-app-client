import { gql, useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import {
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiPlusCircle,
} from "react-icons/hi";
import {
  CategoriesListQuery,
  useCreateCategoryMutation,
  useCreateSubcategoryMutation,
  useDeleteCategoryMutation,
  useDeleteSubcategoryMutation,
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
        id
        name
        budgetAmount
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

export const CREATE_SUBCATEGORY_MUTATION = gql`
  mutation CreateSubcategory(
    $categoryId: ID!
    $name: String!
    $budgetAmount: Int!
  ) {
    createSubcategory(
      categoryId: $categoryId
      name: $name
      budgetAmount: $budgetAmount
    ) {
      name
      budgetAmount
    }
  }
`;

export const DELETE_SUBCATEGORY_MUTATION = gql`
  mutation DeleteSubcategory($id: ID!) {
    deleteSubcategory(id: $id) {
      name
    }
  }
`;

export const CategoriesList: React.FC<Props> = ({
  data,
  refetchCategories,
}) => {
  const [addCategoryField, setAddCategoryField] = useState(false);
  const [addSubcategoryField, setAddSubcategoryField] = useState(false);
  const [newCategoryName, setCategoryName] = useState("");
  const [newSubcategoryBudgetAmount, setSubcategoryBudgetAmount] = useState(0);
  const [newSubcategoryName, setSubcategoryName] = useState("");
  const [openCategory, setOpenCategory] = useState("");

  const [getCategory, { data: categoryData, refetch: refetchCategory }] =
    useLazyQuery(GET_CATEGORY);

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

  const [createSubcategory, { loading: loadingCreateSubcategory }] =
    useCreateSubcategoryMutation({
      onCompleted: ({ createSubcategory }) => {
        setAddSubcategoryField(false);
        setSubcategoryName("");
        toast.success(
          `You have successfully created ${createSubcategory.name} subcategory!`
        );
        refetchCategory();
      },
    });

  const [deleteSubcategory, { loading: loadingDeleteSubcategory }] =
    useDeleteSubcategoryMutation({
      onCompleted: ({ deleteSubcategory }) => {
        toast.success(
          `You have successfully removed ${deleteSubcategory.name} subcategory!`
        );
        refetchCategory();
      },
    });

  return (
    <div>
      {!!data.categories &&
        data.categories.map((category, key) => {
          if (!category) return null;
          const categoryId = category.id;
          const showSubcategories = openCategory === categoryId;

          return (
            <span key={key}>
              <div className="listItem category">
                <div
                  className="categoryTitle"
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
                    <span className="iconContainer">
                      <HiOutlineChevronDown />
                      {category.name}
                    </span>
                  ) : (
                    <span className="iconContainer">
                      <HiOutlineChevronRight />
                      {category.name}
                    </span>
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
              {showSubcategories && (
                <>
                  {!!categoryData?.category?.subcategories &&
                    categoryData?.category?.subcategories.map(
                      (subcategory: any, subcategoryKey: string) => {
                        if (!subcategory) return null;
                        return (
                          <span key={subcategoryKey}>
                            <div className="listItem subcategory">
                              <div className="categoryTitle">
                                <span className="iconContainer">
                                  <HiOutlineChevronRight />
                                  {subcategory.name}
                                </span>
                              </div>
                              <span
                                className="remove red"
                                onClick={() =>
                                  deleteSubcategory({
                                    variables: { id: subcategory.id },
                                  })
                                }
                              >
                                {loadingDeleteSubcategory
                                  ? "removing..."
                                  : "Remove"}
                              </span>
                            </div>
                          </span>
                        );
                      }
                    )}
                  <>
                    {addSubcategoryField && (
                      <div className="listItem subcategory addField">
                        <input
                          type="text"
                          placeholder="Subcategory name"
                          onChange={(e) => setSubcategoryName(e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Subcategory budget"
                          onChange={(e) =>
                            setSubcategoryBudgetAmount(Number(e.target.value))
                          }
                        />
                        <button
                          className="btnCancel"
                          onClick={() => setAddSubcategoryField(false)}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() =>
                            createSubcategory({
                              variables: {
                                categoryId: categoryId,
                                budgetAmount: newSubcategoryBudgetAmount,
                                name: newSubcategoryName,
                              },
                            })
                          }
                        >
                          {loadingCreateSubcategory ? "saving..." : "Add"}
                        </button>
                      </div>
                    )}
                    {!addSubcategoryField && (
                      <div
                        className="listItem category add"
                        onClick={() => setAddSubcategoryField(true)}
                      >
                        <HiPlusCircle />
                        Add subcategory
                      </div>
                    )}
                  </>
                </>
              )}
            </span>
          );
        })}
      <>
        {addCategoryField && (
          <div className="listItem category addField">
            <input
              type="text"
              placeholder="Category name"
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <button
              className="btnCancel"
              onClick={() => setAddCategoryField(false)}
            >
              Cancel
            </button>
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
            <HiPlusCircle />
            Add category
          </div>
        )}
      </>
    </div>
  );
};
