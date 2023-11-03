import React, { useState } from "react";
import {
  Category,
  Subcategory,
  useDeleteCategoryMutation,
  useDeleteSubcategoryMutation,
} from "../../generated/graphql";
import { toast } from "react-toastify";
import { useActionDropdown } from "../../hooks/useActionDropdown";
import { CreateSubcategoryForm } from "../create-subcategory-form/create-subcategory-form";
import { UpdateCategoryForm } from "../update-category-form/update-category-form";
import { UpdateSubcategoryForm } from "../update-subcategory-form/update-subcategory-form";
import { CategoriesListLoading } from "./components/categories-list-loading";
import { CategoriesListNoData } from "./components/categories-list-no-data";
import { CategoriesListData } from "./components/categories-list-data";

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

  const noDataAvailable = !categories || categories.length === 0;
  const dataAvailable = categories !== undefined;

  return (
    <div>
      {loading && <CategoriesListLoading />}
      {!loading && noDataAvailable && <CategoriesListNoData />}
      {!loading && dataAvailable && (
        <CategoriesListData
          categories={categories}
          openCategory={openCategory}
          anchorActionDropdownEl={anchorActionDropdownEl}
          setOpenCategory={setOpenCategory}
          setCreateModalSubcategory={setCreateModalSubcategory}
          handleOnEditCategory={(category: Category) => {
            setUpdateModalCategory(category);
            handleActionsDropdownClose(category.id);
          }}
          handleOnEditSubcategory={(subcategory: Subcategory) => {
            setUpdateModalSubcategory(subcategory);
            handleActionsDropdownClose(subcategory.id);
          }}
          handleOnRemoveCategory={(categoryId: string) => {
            deleteCategory({ variables: { id: categoryId } });
            handleActionsDropdownClose(categoryId);
          }}
          handleOnRemoveSubcategory={(subcategoryId: string) => {
            deleteSubcategory({
              variables: { id: subcategoryId },
            });
            handleActionsDropdownClose(subcategoryId);
          }}
          handleActionsDropdownClick={handleActionsDropdownClick}
          handleActionsDropdownClose={handleActionsDropdownClose}
        />
      )}

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
