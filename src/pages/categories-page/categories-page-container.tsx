import * as React from "react";
import * as Sentry from "@sentry/react";
import Button from "@mui/material/Button";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useCategoriesListQuery } from "../../generated/graphql";
import { CategoriesList } from "../../components/categories-list/categories-list";
import { LoadingScreen } from "../../components/loading-screen/loading-screen";
import { ActionsBar } from "../../components/actions-bar/actions-bar";
import { CreateCategoryForm } from "../../components/create-category-form/create-category-form";
import { MainListItemStyled } from "../../shared";

export const CategoriesPageContainer = () => {
  const [createModalCategory, setCreateModalCategory] = React.useState(false);

  const {
    data: categoriesData,
    error: errorCategories,
    loading: loadingCategories,
    refetch: refetchCategories,
  } = useCategoriesListQuery();

  const categories = categoriesData?.categories;

  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      {/* Global state */}
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

      {/* Loading state */}
      {loadingCategories && <LoadingScreen />}

      {/* Error state */}
      {errorCategories && <div>Error: {errorCategories.message}</div>}

      {/* Data not available state */}
      {!loadingCategories &&
        !errorCategories &&
        (!categories || categories.length === 0) && (
          <MainListItemStyled>No categories</MainListItemStyled>
        )}

      {/* data available state */}
      {!loadingCategories &&
        !errorCategories &&
        categories &&
        categories.length > 0 && (
          <CategoriesList
            categories={categories}
            refetchCategories={refetchCategories}
          />
        )}
    </Sentry.ErrorBoundary>
  );
};
