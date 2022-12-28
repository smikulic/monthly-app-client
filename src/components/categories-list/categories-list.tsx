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
import { LoadingInlineSpinner } from "../loading-inline-spinner/loading-inline-spinner";

interface Props {
  data: CategoriesListQuery;
  loading: boolean;
  refetchCategories: any;
}

export const CategoriesList: React.FC<Props> = ({
  data,
  loading,
  refetchCategories,
}) => {
  const [addCategoryField, setAddCategoryField] = useState(false);
  const [addSubcategoryField, setAddSubcategoryField] = useState(false);
  const [newCategoryName, setCategoryName] = useState("");
  const [newSubcategoryBudgetAmount, setSubcategoryBudgetAmount] = useState(0);
  const [newSubcategoryName, setSubcategoryName] = useState("");
  const [openCategory, setOpenCategory] = useState("");

  const [createCategory, { loading: loadingCreateCategory }] =
    useCreateCategoryMutation({
      variables: {
        name: newCategoryName,
      },
      onCompleted: ({ createCategory }) => {
        refetchCategories();
        setAddCategoryField(false);
        setCategoryName("");
        toast.success(
          `You have successfully created ${createCategory.name} category!`
        );
      },
    });

  const [deleteCategory, { loading: loadingDeleteCategory }] =
    useDeleteCategoryMutation({
      onError: () => {
        toast.error(
          `You need to remove all subcategories before removing its category!`
        );
      },
      onCompleted: ({ deleteCategory }) => {
        refetchCategories();
        toast.success(
          `You have successfully removed ${deleteCategory.name} category!`
        );
      },
    });

  const [createSubcategory, { loading: loadingCreateSubcategory }] =
    useCreateSubcategoryMutation({
      onCompleted: ({ createSubcategory }) => {
        refetchCategories();
        setAddSubcategoryField(false);
        setSubcategoryName("");
        toast.success(
          `You have successfully created ${createSubcategory.name} subcategory!`
        );
      },
    });

  const [deleteSubcategory, { loading: loadingDeleteSubcategory }] =
    useDeleteSubcategoryMutation({
      onCompleted: ({ deleteSubcategory }) => {
        refetchCategories();
        toast.success(
          `You have successfully removed ${deleteSubcategory.name} subcategory!`
        );
      },
    });

  return (
    <div>
      {!!data.categories &&
        data.categories.map((category, key) => {
          if (!category) return null;
          const categoryId = category.id;
          const showSubcategories = openCategory === categoryId;
          const subcategories = category.subcategories;

          const initialValue = 0;
          const totalBudgetAmount = subcategories?.reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue?.budgetAmount!,
            initialValue
          );

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
                    }
                  }}
                >
                  {showSubcategories ? (
                    <span className="iconContainer">
                      <HiOutlineChevronDown />
                      {category.name}
                      {loading && <LoadingInlineSpinner />}
                    </span>
                  ) : (
                    <span className="iconContainer">
                      <HiOutlineChevronRight />
                      {category.name}
                    </span>
                  )}
                </div>
                <span className="budgetAmount orange prominent">
                  {totalBudgetAmount} €
                </span>
                <span
                  className="remove red"
                  onClick={() =>
                    deleteCategory({ variables: { id: categoryId } })
                  }
                >
                  {loadingDeleteCategory || loading ? "removing..." : "Remove"}
                </span>
              </div>
              {showSubcategories && (
                <>
                  {!!subcategories &&
                    subcategories.map((subcategory, subcategoryKey) => {
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
                            <span className="budgetAmount orange">
                              {subcategory.budgetAmount} €
                            </span>
                            <span
                              className="remove red"
                              onClick={() =>
                                deleteSubcategory({
                                  variables: { id: subcategory.id },
                                })
                              }
                            >
                              {loadingDeleteSubcategory || loading
                                ? "removing..."
                                : "Remove"}
                            </span>
                          </div>
                        </span>
                      );
                    })}
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
                          className="btnCancel red"
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
                          {loadingCreateSubcategory || loading
                            ? "saving..."
                            : "Add"}
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
              className="btnCancel red"
              onClick={() => setAddCategoryField(false)}
            >
              Cancel
            </button>
            <button onClick={() => createCategory()}>
              {loadingCreateCategory || loading ? "saving..." : "Add"}
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
