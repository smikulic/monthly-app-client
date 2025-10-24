import { useState } from "react";
import { useCategoriesListQuery } from "@/generated/graphql";
import { ProminentButtonStyled } from "@/shared";
import {
  CategoriesList,
  CategoryFormFactory,
  SubcategoryFormFactory,
} from "@/features/categories";
import { ActionsBar } from "@/components/layout";
import { useCategoriesActions } from "./use-categories-actions-hook";

export const CategoriesPageContainer = () => {
  const [createModalCategory, setCreateModalCategory] = useState(false);

  const {
    data: categoriesData,
    loading: loadingCategories,
    refetch: refetchCategories,
  } = useCategoriesListQuery();

  const {
    openCategory,
    createModalSubcategory,
    updateModalCategory,
    updateModalSubcategory,
    anchorActionDropdownEl,
    setOpenCategory,
    setCreateModalSubcategory,
    setUpdateModalCategory,
    setUpdateModalSubcategory,
    handleEditCategory,
    handleEditSubcategory,
    handleRemoveCategory,
    handleRemoveSubcategory,
    handleActionsDropdownClick,
    handleActionsDropdownClose,
  } = useCategoriesActions(refetchCategories);

  const categories = categoriesData?.categories;

  return (
    <>
      <ActionsBar>
        {/* Empty span to push button to the right */}
        <span></span>
        <ProminentButtonStyled
          onClick={() => setCreateModalCategory(true)}
          data-testid="add-category-button"
        >
          Add category
        </ProminentButtonStyled>
      </ActionsBar>

      <CategoriesList
        loading={loadingCategories}
        categories={categories}
        openCategory={openCategory}
        createModalSubcategory={createModalSubcategory}
        updateModalCategory={updateModalCategory}
        updateModalSubcategory={updateModalSubcategory}
        anchorActionDropdownEl={anchorActionDropdownEl}
        onSetOpenCategory={setOpenCategory}
        onSetCreateModalSubcategory={setCreateModalSubcategory}
        onEditCategory={handleEditCategory}
        onEditSubcategory={handleEditSubcategory}
        onRemoveCategory={handleRemoveCategory}
        onRemoveSubcategory={handleRemoveSubcategory}
        onActionsDropdownClick={handleActionsDropdownClick}
        onActionsDropdownClose={handleActionsDropdownClose}
      />

      {createModalCategory && (
        <CategoryFormFactory
          open={createModalCategory}
          closeForm={() => {
            refetchCategories();
            setCreateModalCategory(false);
          }}
        />
      )}
      {createModalSubcategory && (
        <SubcategoryFormFactory
          open={Boolean(createModalSubcategory)}
          closeForm={() => {
            refetchCategories();
            setCreateModalSubcategory(null);
          }}
          presetCategoryId={createModalSubcategory}
          categories={categories!}
        />
      )}
      {updateModalCategory && (
        <CategoryFormFactory
          open={Boolean(updateModalCategory)}
          closeForm={() => {
            refetchCategories();
            setUpdateModalCategory(null);
          }}
          formData={updateModalCategory}
        />
      )}
      {updateModalSubcategory && (
        <SubcategoryFormFactory
          open={Boolean(updateModalSubcategory)}
          closeForm={() => {
            refetchCategories();
            setUpdateModalSubcategory(null);
          }}
          presetCategoryId={""}
          categories={categories!}
          formData={updateModalSubcategory}
        />
      )}
    </>
  );
};
