import { useState } from "react";
import { toast } from "react-toastify";
import {
  Category,
  Subcategory,
  useDeleteCategoryMutation,
  useDeleteSubcategoryMutation,
} from "@/generated/graphql";
import { useActionDropdown } from "@/hooks/useActionDropdown";
import { TOAST_MESSAGES, ENTITY_NAMES } from "@/constants/forms";

export const useCategoriesActions = (
  refetchCategories: () => Promise<unknown>
) => {
  const {
    anchorActionDropdownEl,
    handleActionsDropdownClick,
    handleActionsDropdownClose,
  } = useActionDropdown();

  const [openCategory, setOpenCategory] = useState("");
  const [createModalSubcategory, setCreateModalSubcategory] = useState<
    string | null
  >(null);
  const [updateModalCategory, setUpdateModalCategory] =
    useState<Category | null>(null);
  const [updateModalSubcategory, setUpdateModalSubcategory] =
    useState<Subcategory | null>(null);

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

  const handleEditCategory = (category: Category) => {
    setUpdateModalCategory(category);
    handleActionsDropdownClose(category.id);
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setUpdateModalSubcategory(subcategory);
    handleActionsDropdownClose(subcategory.id);
  };

  const handleRemoveCategory = (categoryId: string) => {
    deleteCategory({ variables: { id: categoryId } });
    handleActionsDropdownClose(categoryId);
  };

  const handleRemoveSubcategory = (subcategoryId: string) => {
    deleteSubcategory({ variables: { id: subcategoryId } });
    handleActionsDropdownClose(subcategoryId);
  };

  return {
    // State
    openCategory,
    createModalSubcategory,
    updateModalCategory,
    updateModalSubcategory,
    anchorActionDropdownEl,

    // Actions
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
  };
};
