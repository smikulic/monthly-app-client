import * as React from "react";
import Button from "@mui/material/Button";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useCategoriesListQuery } from "../../generated/graphql";
import { CategoriesList } from "../../components/categories-list/categories-list";
import { ActionsBar } from "../../components/actions-bar/actions-bar";
import { CreateCategoryForm } from "../../components/create-category-form/create-category-form";

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
        <Button
          variant="contained"
          endIcon={<AddCircleRoundedIcon />}
          onClick={() => setCreateModalCategory(true)}
        >
          Add category
        </Button>
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
