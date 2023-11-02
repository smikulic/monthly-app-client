import * as React from "react";
import { useCategoriesListQuery } from "../../generated/graphql";
import { CategoriesList } from "../../components/categories-list/categories-list";
import { ActionsBar } from "../../components/actions-bar/actions-bar";
import { CreateCategoryForm } from "../../components/create-category-form/create-category-form";
import { ProminentButtonStyled } from "../../shared";

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
        {/* <Typography
          variant="h6"
          borderBottom="1px solid"
          borderColor="warning.main"
        >
          Budget
        </Typography> */}
        <ProminentButtonStyled onClick={() => setCreateModalCategory(true)}>
          Add category
        </ProminentButtonStyled>
        {createModalCategory && (
          <CreateCategoryForm
            open={createModalCategory}
            closeForm={() => setCreateModalCategory(false)}
            refetch={refetchCategories}
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
