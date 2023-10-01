import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import {
  CategoriesListQuery,
  useDeleteCategoryMutation,
  useDeleteSubcategoryMutation,
} from "../../generated/graphql";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { CreateCategoryForm } from "../create-category-form/create-category-form";
import { CreateSubcategoryForm } from "../create-subcategory-form/create-subcategory-form";
import { AddFormStyled } from "../../shared";
import { useActionDropdown } from "../../hooks/useActionDropdown";
import { ListItemHeader } from "../list-item-header/list-item-header";

interface Props {
  data: CategoriesListQuery;
  loading: boolean;
  refetchCategories: () => Promise<unknown>;
}

export const CategoriesList: React.FC<Props> = ({
  data,
  loading,
  refetchCategories,
}) => {
  const {
    anchorActionDropdownEl,
    handleActionsDropdownClick,
    handleActionsDropdownClose,
  } = useActionDropdown();

  const [categoryFormVisible, setCategoryFormVisible] = useState(false);
  const [subcategoryFormVisible, setSubcategoryFormVisible] = useState(false);
  const [openCategory, setOpenCategory] = useState("");

  const [deleteCategory] = useDeleteCategoryMutation({
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

  const [deleteSubcategory] = useDeleteSubcategoryMutation({
    onError: () => {
      toast.error(
        `You need to remove all subcategory expenses before removing its subcategory!`
      );
    },
    onCompleted: ({ deleteSubcategory }) => {
      refetchCategories();
      toast.success(
        `You have successfully removed ${deleteSubcategory.name} subcategory!`
      );
    },
  });

  return (
    <div>
      {data.categories.map((category) => {
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
          <React.Fragment key={categoryId}>
            <div className="listItem category">
              <ListItemHeader
                title={category.name}
                showExpand={!showSubcategories}
                showCollapse={showSubcategories}
                onToggleExpand={() => {
                  if (showSubcategories) {
                    setOpenCategory("");
                  } else {
                    setOpenCategory(categoryId);
                  }
                }}
              />
              <div className="categoryDetails">
                <div className="categoryAmount">{totalBudgetAmount} €</div>
                <div>
                  <IconButton
                    id={`long-menu-icon-${categoryId}`}
                    aria-haspopup="true"
                    size="small"
                    onClick={(event) =>
                      handleActionsDropdownClick(event, categoryId)
                    }
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id={`long-menu-${categoryId}`}
                    anchorEl={anchorActionDropdownEl[categoryId]}
                    open={Boolean(anchorActionDropdownEl[categoryId])}
                    onClose={() => handleActionsDropdownClose(categoryId)}
                  >
                    <MenuItem
                      disabled
                      onClick={() => handleActionsDropdownClose(categoryId)}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        deleteCategory({ variables: { id: categoryId } });
                        handleActionsDropdownClose(categoryId);
                      }}
                    >
                      Remove
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
            {showSubcategories && (
              <>
                {!!subcategories &&
                  subcategories.map((subcategory) => {
                    if (!subcategory) return null;

                    const subcategoryId = subcategory.id;

                    return (
                      <span key={subcategoryId}>
                        <div className="listItem subcategory">
                          <ListItemHeader title={subcategory.name} />
                          <div className="categoryDetails">
                            <div className="categoryAmount">
                              {subcategory.budgetAmount} €
                            </div>
                            <div>
                              <IconButton
                                id={`long-menu-icon-${subcategoryId}`}
                                aria-haspopup="true"
                                size="small"
                                onClick={(event) =>
                                  handleActionsDropdownClick(
                                    event,
                                    subcategoryId
                                  )
                                }
                              >
                                <MoreVertIcon />
                              </IconButton>
                              <Menu
                                id={`long-menu-${subcategoryId}`}
                                anchorEl={anchorActionDropdownEl[subcategoryId]}
                                open={Boolean(
                                  anchorActionDropdownEl[subcategoryId]
                                )}
                                onClose={() =>
                                  handleActionsDropdownClose(subcategoryId)
                                }
                              >
                                <MenuItem
                                  disabled
                                  onClick={() =>
                                    handleActionsDropdownClose(subcategoryId)
                                  }
                                >
                                  Edit
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    deleteSubcategory({
                                      variables: { id: subcategoryId },
                                    });
                                    handleActionsDropdownClose(subcategoryId);
                                  }}
                                >
                                  Remove
                                </MenuItem>
                              </Menu>
                            </div>
                          </div>
                        </div>
                      </span>
                    );
                  })}
                <>
                  {subcategoryFormVisible && (
                    <AddFormStyled>
                      <CreateSubcategoryForm
                        categoryId={categoryId}
                        refetchCategories={refetchCategories}
                        closeForm={() => setSubcategoryFormVisible(false)}
                      />
                    </AddFormStyled>
                  )}
                  {!subcategoryFormVisible && (
                    <div
                      className="listItem subcategory add"
                      onClick={() => setSubcategoryFormVisible(true)}
                    >
                      <AddCircleRoundedIcon />
                      Add subcategory
                    </div>
                  )}
                </>
              </>
            )}
          </React.Fragment>
        );
      })}
      <>
        {categoryFormVisible && (
          <AddFormStyled>
            <CreateCategoryForm
              refetchCategories={refetchCategories}
              closeForm={() => setCategoryFormVisible(false)}
            />
          </AddFormStyled>
        )}
        {!categoryFormVisible && (
          <div
            className="listItem category add"
            onClick={() => setCategoryFormVisible(true)}
          >
            <AddCircleRoundedIcon />
            Add category
          </div>
        )}
      </>
    </div>
  );
};
