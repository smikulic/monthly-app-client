import * as React from "react";
import Button from "@mui/material/Button";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useCategoriesListQuery } from "../../generated/graphql";
import { CategoriesList } from "../../components/categories-list/categories-list";
import { ActionsBar } from "../../components/actions-bar/actions-bar";
import { CreateCategoryForm } from "../../components/create-category-form/create-category-form";
import { MainListItemStyled } from "../../shared";
import { PageContainer } from "../../components/page-container/page-container";

export const CategoriesPageContainer = () => {
  const [createModalCategory, setCreateModalCategory] = React.useState(false);

  const {
    data: categoriesData,
    error: errorCategories,
    loading: loadingCategories,
    refetch: refetchCategories,
  } = useCategoriesListQuery();

  const categories = categoriesData?.categories;
  const noDataAvailable = Boolean(
    !loadingCategories &&
      !errorCategories &&
      (!categories || categories.length === 0)
  );

  return (
    <PageContainer
      loading={loadingCategories}
      noData={noDataAvailable}
      actionsBarComponent={
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
      }
      dataAvailableComponent={
        <CategoriesList
          categories={categories!}
          refetchCategories={refetchCategories}
        />
      }
      noDataAvailableComponent={
        <MainListItemStyled>No categories</MainListItemStyled>
      }
    />
  );
};
