import { FC, MouseEvent } from "react";
import { Category, Subcategory } from "@/generated/graphql";
import { AnchorActionDropdownElProps } from "@/hooks/useActionDropdown";
import { ListLoading } from "@/components/ui/ListLoading";
import { CategoriesListNoData } from "./components/categories-list-no-data";
import { CategoriesListData } from "./components/categories-list-data";

interface Props {
  loading: boolean;
  categories?: Category[];
  openCategory: string;
  createModalSubcategory: string | null;
  updateModalCategory: Category | null;
  updateModalSubcategory: Subcategory | null;
  anchorActionDropdownEl: AnchorActionDropdownElProps;
  onSetOpenCategory: (categoryId: string) => void;
  onSetCreateModalSubcategory: (categoryId: string | null) => void;
  onEditCategory: (category: Category) => void;
  onEditSubcategory: (subcategory: Subcategory) => void;
  onRemoveCategory: (categoryId: string) => void;
  onRemoveSubcategory: (subcategoryId: string) => void;
  onActionsDropdownClick: (
    event: MouseEvent<HTMLElement>,
    anchorIndex: string
  ) => void;
  onActionsDropdownClose: (anchorIndex: string) => void;
}

export const CategoriesList: FC<Props> = ({
  loading,
  categories,
  openCategory,
  anchorActionDropdownEl,
  onSetOpenCategory,
  onSetCreateModalSubcategory,
  onEditCategory,
  onEditSubcategory,
  onRemoveCategory,
  onRemoveSubcategory,
  onActionsDropdownClick,
  onActionsDropdownClose,
}) => {
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
          setOpenCategory={onSetOpenCategory}
          setCreateModalSubcategory={onSetCreateModalSubcategory}
          onEditCategory={onEditCategory}
          onEditSubcategory={onEditSubcategory}
          onRemoveCategory={onRemoveCategory}
          onRemoveSubcategory={onRemoveSubcategory}
          onActionsDropdownClick={onActionsDropdownClick}
          onActionsDropdownClose={onActionsDropdownClose}
        />
      )}
    </div>
  );
};
