import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  CategoriesListQuery,
  useDeleteCategoryMutation,
  useDeleteSubcategoryMutation,
} from "../../generated/graphql";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { LoadingInlineSpinner } from "../loading-inline-spinner/loading-inline-spinner";
import { CreateCategoryForm } from "../create-category-form/create-category-form";
import { CreateSubcategoryForm } from "../create-subcategory-form/create-subcategory-form";
import { AddFormContainer } from "../../shared";

export type AnchorActionDropdownElProps = {
  [key: string]: null | (EventTarget & HTMLElement);
};

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
  const [anchorActionDropdownEl, setAnchorActionDropdownEl] =
    React.useState<AnchorActionDropdownElProps>({});

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

  const handleActionsDropdownClick = (
    event: React.MouseEvent<HTMLElement>,
    anchorIndex: string
  ) => {
    setAnchorActionDropdownEl({
      ...anchorActionDropdownEl,
      [anchorIndex]: event.currentTarget,
    });
  };

  const handleActionsDropdownClose = (anchorIndex: string) => {
    setAnchorActionDropdownEl({
      ...anchorActionDropdownEl,
      [anchorIndex]: null,
    });
  };

  return (
    <div>
      {!!data.categories &&
        data.categories.map((category) => {
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
                      <ExpandMoreIcon />
                      {category.name}
                      {loading && <LoadingInlineSpinner />}
                    </span>
                  ) : (
                    <span className="iconContainer">
                      <ChevronRightIcon />
                      {category.name}
                    </span>
                  )}
                </div>
                <div className="categoryDetails">
                  <div className="categoryAmount prominent">
                    {totalBudgetAmount} €
                  </div>
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
                            <div className="categoryTitle">
                              <span className="iconContainer">
                                {subcategory.name}
                              </span>
                            </div>
                            <div className="categoryDetails">
                              <div className="categoryAmount prominent">
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
                                  anchorEl={
                                    anchorActionDropdownEl[subcategoryId]
                                  }
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
                      <AddFormContainer>
                        <CreateSubcategoryForm
                          categoryId={categoryId}
                          refetchCategories={refetchCategories}
                          closeForm={() => setSubcategoryFormVisible(false)}
                        />
                      </AddFormContainer>
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
          <AddFormContainer>
            <CreateCategoryForm
              refetchCategories={refetchCategories}
              closeForm={() => setCategoryFormVisible(false)}
            />
          </AddFormContainer>
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
