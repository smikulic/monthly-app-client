import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Category,
  Subcategory,
  useDeleteCategoryMutation,
  useDeleteSubcategoryMutation,
} from "../../generated/graphql";
import { toast } from "react-toastify";
import { useActionDropdown } from "../../hooks/useActionDropdown";
import { ListItemHeader } from "../list-item-header/list-item-header";
import { CreateSubcategoryForm } from "../create-subcategory-form/create-subcategory-form";
import { UpdateCategoryForm } from "../update-category-form/update-category-form";
import { UpdateSubcategoryForm } from "../update-subcategory-form/update-subcategory-form";
import { MainListItemStyled, SubcategoryListItemStyled } from "../../shared";
import {
  CategoryAmountStyled,
  CategoryDetailsStyled,
} from "./categories-list-style";
import { ListAddField } from "../list-add-field/list-add-field";
import { formatAmount } from "../../utils/format";
import { Skeleton } from "@mui/material";

interface Props {
  loading: boolean;
  categories?: Category[];
  refetchCategories: () => Promise<unknown>;
}

export const CategoriesList: React.FC<Props> = ({
  loading,
  categories,
  refetchCategories,
}) => {
  const {
    anchorActionDropdownEl,
    handleActionsDropdownClick,
    handleActionsDropdownClose,
  } = useActionDropdown();

  const [openCategory, setOpenCategory] = useState("");
  const [createModalSubcategory, setCreateModalSubcategory] = React.useState<
    string | null
  >(null);
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
      {loading && (
        <>
          <MainListItemStyled>
            <Skeleton animation="wave" width={200} height={34} />
            <CategoryDetailsStyled>
              <Skeleton animation="wave" width={60} height={34} />
            </CategoryDetailsStyled>
          </MainListItemStyled>
          <MainListItemStyled>
            <Skeleton animation="wave" width={200} height={34} />
            <CategoryDetailsStyled>
              <Skeleton animation="wave" width={60} height={34} />
            </CategoryDetailsStyled>
          </MainListItemStyled>
          <MainListItemStyled>
            <Skeleton animation="wave" width={200} height={34} />
            <CategoryDetailsStyled>
              <Skeleton animation="wave" width={60} height={34} />
            </CategoryDetailsStyled>
          </MainListItemStyled>
        </>
      )}
      {!loading && (!categories || categories.length === 0) && (
        <MainListItemStyled>No categories</MainListItemStyled>
      )}
      {!loading &&
        categories?.map((category: Category) => {
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
              <MainListItemStyled active={showSubcategories}>
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
                    {formatAmount(totalBudgetAmount || 0)}
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
                                {formatAmount(subcategory.budgetAmount || 0)}
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
                                      handleActionsDropdownClose(subcategoryId);
                                    }}
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
                            </CategoryDetailsStyled>
                          </SubcategoryListItemStyled>
                        </span>
                      );
                    })}

                  <ListAddField
                    text={`Add ${category.name} subcategory`}
                    onClick={() => setCreateModalSubcategory(category.id)}
                  />
                </>
              )}
            </React.Fragment>
          );
        })}

      {createModalSubcategory && (
        <CreateSubcategoryForm
          open={Boolean(createModalSubcategory)}
          categoryId={createModalSubcategory}
          closeForm={() => setCreateModalSubcategory(null)}
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
          categories={categories!}
          closeForm={() => setUpdateModalSubcategory(null)}
          refetch={refetchCategories}
        />
      )}
    </div>
  );
};
