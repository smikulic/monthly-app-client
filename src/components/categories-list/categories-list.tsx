import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Category,
  Subcategory,
  useDeleteCategoryMutation,
  useDeleteSubcategoryMutation,
} from "@/generated/graphql";
import { useActionDropdown } from "@/hooks/useActionDropdown";
import { CategoryFormFactory } from "@/components/category-form-factory/category-form-factory";
import { SubcategoryFormFactory } from "@/components/subcategory-form-factory/subcategory-form-factory";
import { ListLoading } from "@/components/ui/ListLoading";
import { CategoriesListNoData } from "./components/categories-list-no-data";
import { CategoriesListData } from "./components/categories-list-data";
import { TOAST_MESSAGES, ENTITY_NAMES } from "@/constants/forms";

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
      toast.error(TOAST_MESSAGES.ERROR.CATEGORY_HAS_SUBCATEGORIES);
    },
    onCompleted: ({ deleteCategory }) => {
      refetchCategories();
      toast.success(
        TOAST_MESSAGES.SUCCESS.DELETE(
          ENTITY_NAMES.CATEGORY,
          deleteCategory.name
        )
      );
    },
  });

  const [deleteSubcategory] = useDeleteSubcategoryMutation({
    onError: () => {
      toast.error(TOAST_MESSAGES.ERROR.SUBCATEGORY_HAS_EXPENSES);
    },
    onCompleted: ({ deleteSubcategory }) => {
      refetchCategories();
      toast.success(
        TOAST_MESSAGES.SUCCESS.DELETE(
          ENTITY_NAMES.SUBCATEGORY,
          deleteSubcategory.name
        )
      );
    },
  });

  const noDataAvailable = !categories || categories.length === 0;
  const dataAvailable = categories !== undefined;

  return (
    <div>
      {loading && <ListLoading height={34} itemCount={3} showDetails />}
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
    </div>
  );
};
