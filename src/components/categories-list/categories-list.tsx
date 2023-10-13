import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  CategoriesListQuery,
  Category,
  Subcategory,
  useDeleteCategoryMutation,
  useDeleteSubcategoryMutation,
} from "../../generated/graphql";
import { toast } from "react-toastify";
import { useActionDropdown } from "../../hooks/useActionDropdown";
import { ListItemHeader } from "../list-item-header/list-item-header";
import { CreateSubcategoryForm } from "../create-subcategory-form/create-subcategory-form";
import { CreateCategoryForm } from "../create-category-form/create-category-form";
import { UpdateCategoryForm } from "../update-category-form/update-category-form";
import { UpdateSubcategoryForm } from "../update-subcategory-form/update-subcategory-form";
import { MainListItemStyled, SubcategoryListItemStyled } from "../../shared";
import {
  CategoriesActionsBarStyled,
  CategoryAmountStyled,
  CategoryDetailsStyled,
} from "./categories-list-style";
import Button from "@mui/material/Button";

interface Props {
  data: CategoriesListQuery;
  refetchCategories: () => Promise<unknown>;
}

export const CategoriesList: React.FC<Props> = ({
  data,
  refetchCategories,
}) => {
  const {
    anchorActionDropdownEl,
    handleActionsDropdownClick,
    handleActionsDropdownClose,
  } = useActionDropdown();

  const [openCategory, setOpenCategory] = useState("");
  const [createModalCategory, setCreateModalCategory] = React.useState(false);
  const [createModalSubcategory, setCreateModalSubcategory] =
    React.useState(false);
  const [updateModalCategory, setUpdateModalCategory] =
    React.useState<Category | null>(null);
  const [updateModalSubcategory, setUpdateModalSubcategory] =
    React.useState<Subcategory | null>(null);

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
      {data.categories.length === 0 && (
        <MainListItemStyled>
          No categories available
          <CategoryDetailsStyled>
            <Button
              variant="contained"
              endIcon={<AddCircleRoundedIcon />}
              onClick={() => setCreateModalCategory(true)}
            >
              Add category
            </Button>
          </CategoryDetailsStyled>
        </MainListItemStyled>
      )}

      {data.categories.length > 0 && (
        <>
          <CategoriesActionsBarStyled>
            <Button
              sx={{ mr: 2 }}
              variant="contained"
              endIcon={<AddCircleRoundedIcon />}
              onClick={() => setCreateModalSubcategory(true)}
            >
              Add subcategory
            </Button>
            <Button
              variant="contained"
              endIcon={<AddCircleRoundedIcon />}
              onClick={() => setCreateModalCategory(true)}
            >
              Add category
            </Button>
          </CategoriesActionsBarStyled>

          {data.categories.map((category: Category) => {
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
                <MainListItemStyled>
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
                  <CategoryDetailsStyled>
                    <CategoryAmountStyled>
                      {totalBudgetAmount} €
                    </CategoryAmountStyled>
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
                          onClick={() => {
                            setUpdateModalCategory(category);
                            handleActionsDropdownClose(categoryId);
                          }}
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
                  </CategoryDetailsStyled>
                </MainListItemStyled>
                {showSubcategories && (
                  <>
                    {!!subcategories &&
                      subcategories.map((subcategory) => {
                        if (!subcategory) return null;

                        const subcategoryId = subcategory.id;

                        return (
                          <span key={subcategoryId}>
                            <SubcategoryListItemStyled>
                              <ListItemHeader title={subcategory.name} />
                              <CategoryDetailsStyled>
                                <CategoryAmountStyled>
                                  {subcategory.budgetAmount} €
                                </CategoryAmountStyled>
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
                                      onClick={() => {
                                        setUpdateModalSubcategory(subcategory);
                                        handleActionsDropdownClose(
                                          subcategoryId
                                        );
                                      }}
                                    >
                                      Edit
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        deleteSubcategory({
                                          variables: { id: subcategoryId },
                                        });
                                        handleActionsDropdownClose(
                                          subcategoryId
                                        );
                                      }}
                                    >
                                      Remove
                                    </MenuItem>
                                  </Menu>
                                </div>
                              </CategoryDetailsStyled>
                            </SubcategoryListItemStyled>
                          </span>
                        );
                      })}
                  </>
                )}
              </React.Fragment>
            );
          })}

          {createModalCategory && (
            <CreateCategoryForm
              open={createModalCategory}
              closeForm={() => setCreateModalCategory(false)}
              refetch={refetchCategories}
            />
          )}
          {createModalSubcategory && (
            <CreateSubcategoryForm
              open={Boolean(createModalSubcategory)}
              categories={data.categories}
              closeForm={() => setCreateModalSubcategory(false)}
              refetch={refetchCategories}
            />
          )}
          {updateModalCategory && (
            <UpdateCategoryForm
              open={Boolean(updateModalCategory)}
              formData={updateModalCategory}
              closeForm={() => setUpdateModalCategory(null)}
              refetch={refetchCategories}
            />
          )}
          {updateModalSubcategory && (
            <UpdateSubcategoryForm
              open={Boolean(updateModalSubcategory)}
              formData={updateModalSubcategory}
              categories={data.categories}
              closeForm={() => setUpdateModalSubcategory(null)}
              refetch={refetchCategories}
            />
          )}
        </>
      )}
    </div>
  );
};
