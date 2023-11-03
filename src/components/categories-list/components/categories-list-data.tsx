import React, { Dispatch, SetStateAction } from "react";
import { Category, Subcategory } from "../../../generated/graphql";
import { formatAmount } from "../../../utils/format";
import { AnchorActionDropdownElProps } from "../../../hooks/useActionDropdown";
import { CategoryListItem } from "./category-list-item";

interface Props {
  categories: Category[];
  openCategory: string;
  anchorActionDropdownEl: AnchorActionDropdownElProps;
  setOpenCategory: Dispatch<SetStateAction<string>>;
  setCreateModalSubcategory: Dispatch<SetStateAction<string | null>>;
  handleOnEditCategory: (category: Category) => void;
  handleOnEditSubcategory: (subcategory: Subcategory) => void;
  handleOnRemoveCategory: (categoryId: string) => void;
  handleOnRemoveSubcategory: (subcategoryId: string) => void;
  handleActionsDropdownClick: (
    event: React.MouseEvent<HTMLElement>,
    anchorIndex: string
  ) => void;
  handleActionsDropdownClose: (anchorIndex: string) => void;
}

export const CategoriesListData: React.FC<Props> = ({
  categories,
  openCategory,
  anchorActionDropdownEl,
  setOpenCategory,
  setCreateModalSubcategory,
  handleOnEditCategory,
  handleOnEditSubcategory,
  handleOnRemoveCategory,
  handleOnRemoveSubcategory,
  handleActionsDropdownClick,
  handleActionsDropdownClose,
}) => {
  return (
    <>
      {categories.map((category: Category) => {
        const categoryId = category.id;
        const showSubcategories = openCategory === categoryId;
        const subcategories = category.subcategories;

        const initialValue = 0;
        const totalBudgetAmount = subcategories?.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue?.budgetAmount!,
          initialValue
        );

        return (
          <React.Fragment key={categoryId}>
            <CategoryListItem
              category={category}
              categoryAmount={formatAmount(totalBudgetAmount || 0)}
              showSubcategories={showSubcategories}
              anchorActionDropdownEl={anchorActionDropdownEl}
              onToggleExpand={() =>
                setOpenCategory(showSubcategories ? "" : categoryId)
              }
              handleOnEditCategory={() => handleOnEditCategory(category)}
              handleOnRemoveCategory={() => handleOnRemoveCategory(categoryId)}
              handleOnEditSubcategory={handleOnEditSubcategory}
              handleOnRemoveSubcategory={handleOnRemoveSubcategory}
              handleOpenCreateSubcategory={() =>
                setCreateModalSubcategory(categoryId)
              }
              handleActionsDropdownClick={handleActionsDropdownClick}
              handleActionsDropdownClose={handleActionsDropdownClose}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};
