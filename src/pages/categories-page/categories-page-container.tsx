import * as React from "react";
import { useCategoriesListQuery } from "../../generated/graphql";
import { CategoriesList } from "../../components/categories-list/categories-list";
import { ActionsBar } from "../../components/actions-bar/actions-bar";
import { ProminentButtonStyled } from "../../shared";
import { CategoryFormFactory } from "../../components/category-form-factory/category-form-factory";

export const CategoriesPageContainer = () => {
  const [createModalCategory, setCreateModalCategory] = React.useState(false);

  const {
    data: categoriesData,
    loading: loadingCategories,
    refetch: refetchCategories,
  } = useCategoriesListQuery();

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
        {createModalCategory && (
          <CategoryFormFactory
            open={createModalCategory}
            closeForm={() => {
              refetchCategories();
              setCreateModalCategory(false);
            }}
          />
        )}
      </ActionsBar>
      <CategoriesList
        loading={loadingCategories}
        categories={categories}
        refetchCategories={refetchCategories}
      />
    </>
  );
};
