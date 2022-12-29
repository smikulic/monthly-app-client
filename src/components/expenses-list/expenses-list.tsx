import { useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import { format } from "date-fns";
import { HiOutlineChevronRight, HiOutlineChevronDown } from "react-icons/hi";
import { CategoriesListQuery } from "../../generated/graphql";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { GET_CATEGORY } from "./expenses-list-queries";
import { LoadingInlineSpinner } from "../loading-inline-spinner/loading-inline-spinner";

interface Props {
  data: CategoriesListQuery;
  refetchCategories: any;
}

export const ExpensesList: React.FC<Props> = ({ data, refetchCategories }) => {
  const [openCategory, setOpenCategory] = useState("");
  const [openSubcategory, setOpenSubcategory] = useState("");

  const [
    getCategory,
    { data: categoryData, refetch: refetchCategory, loading: loadingCategory },
  ] = useLazyQuery(GET_CATEGORY);

  return (
    <div>
      {!!data.categories &&
        data.categories.map((category, key) => {
          if (!category) return null;
          const categoryId = category.id;
          const showSubcategories = openCategory === categoryId;

          console.log({ categoryData });

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
                    <span className="iconContainer prominent">
                      <HiOutlineChevronDown />
                      {category.name}
                      {loadingCategory && <LoadingInlineSpinner />}
                    </span>
                  ) : (
                    <span className="iconContainer">
                      <HiOutlineChevronRight />
                      {category.name}
                    </span>
                  )}
                </div>
              </div>
              {showSubcategories && (
                <>
                  {!!categoryData?.category?.subcategories &&
                    categoryData?.category?.subcategories.map(
                      (subcategory: any, subcategoryKey: string) => {
                        if (!subcategory) return null;
                        const subcategoryId = subcategory.id;
                        const showExpenses = openSubcategory === subcategoryId;
                        return (
                          <span key={subcategoryKey}>
                            <div className="listItem subcategory">
                              <div
                                className="categoryTitle"
                                onClick={() => {
                                  if (showExpenses) {
                                    setOpenSubcategory("");
                                  } else {
                                    setOpenSubcategory(subcategoryId);
                                  }
                                }}
                              >
                                {showExpenses ? (
                                  <span className="iconContainer prominent">
                                    <HiOutlineChevronDown />
                                    {subcategory.name}
                                  </span>
                                ) : (
                                  <span className="iconContainer">
                                    <HiOutlineChevronRight />
                                    {subcategory.name}
                                  </span>
                                )}
                              </div>
                              <span className="budgetAmount orange">
                                {subcategory.budgetAmount} €
                              </span>
                            </div>
                            {showExpenses && (
                              <>
                                {!!categoryData?.category?.subcategories[
                                  subcategoryKey
                                ] &&
                                  categoryData?.category?.subcategories[
                                    subcategoryKey
                                  ].expenses.map(
                                    (expense: any, expenseKey: string) => {
                                      if (!expense) return null;
                                      const expenseISODate = Number(
                                        expense.date
                                      );

                                      return (
                                        <span key={expenseKey}>
                                          <div className="listItem expense">
                                            <div className="expenseFields">
                                              <span className="expenseField expenseDate">
                                                {format(
                                                  expenseISODate,
                                                  "dd MMM"
                                                )}
                                              </span>
                                              <span className="expenseField expenseAmount red">
                                                {expense.amount} €
                                              </span>
                                            </div>
                                          </div>
                                        </span>
                                      );
                                    }
                                  )}
                              </>
                            )}
                          </span>
                        );
                      }
                    )}
                </>
              )}
            </span>
          );
        })}
    </div>
  );
};
