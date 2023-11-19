import React, { Dispatch, SetStateAction } from "react";
import { Category, Subcategory } from "../../../generated/graphql";
import { ListAddField } from "../../list-add-field/list-add-field";
import { formatAmount } from "../../../utils/format";
import { AnchorActionDropdownElProps } from "../../../hooks/useActionDropdown";
import { CategorySubcategoriesList } from "./category-subcategories-list";
import { MainListItemStyled } from "../../../shared";
import { ListItemHeader } from "../../list-item-header/list-item-header";
import {
  CategoryAmountStyled,
  CategoryDetailsStyled,
} from "../categories-list-style";
import { IconMenu } from "../../icon-menu/icon-menu";
import { UserContext } from "../../../App";

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
  const userCurrency = React.useContext(UserContext);

  return (
    <>
      {categories.map((category: Category) => {
        const categoryId = category.id;
        const categoryName = category.name;
        const expanded = openCategory === categoryId;
        const subcategories = category.subcategories as Subcategory[];

        const initialValue = 0;
        const totalBudgetAmount = subcategories.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue?.budgetAmount!,
          initialValue
        );

        return (
          <React.Fragment key={categoryId}>
            <MainListItemStyled active={expanded}>
              <ListItemHeader
                title={categoryName}
                showExpand={!expanded}
                showCollapse={expanded}
                onToggleExpand={() =>
                  setOpenCategory(expanded ? "" : categoryId)
                }
              />
              <CategoryDetailsStyled>
                <CategoryAmountStyled>
                  {formatAmount(totalBudgetAmount || 0, userCurrency)}
                </CategoryAmountStyled>
                <IconMenu
                  itemId={categoryId}
                  anchorActionDropdownEl={anchorActionDropdownEl}
                  handleOnEdit={() => handleOnEditCategory(category)}
                  handleOnRemove={() => handleOnRemoveCategory(categoryId)}
                  handleOnOpenMenu={(event: React.MouseEvent<HTMLElement>) =>
                    handleActionsDropdownClick(event, categoryId)
                  }
                  handleOnCloseMenu={() =>
                    handleActionsDropdownClose(categoryId)
                  }
                />
              </CategoryDetailsStyled>
            </MainListItemStyled>

            {expanded && (
              <>
                {subcategories && (
                  <CategorySubcategoriesList
                    subcategories={subcategories}
                    anchorActionDropdownEl={anchorActionDropdownEl}
                    handleOnEditSubcategory={handleOnEditSubcategory}
                    handleOnRemoveSubcategory={handleOnRemoveSubcategory}
                    handleActionsDropdownClick={handleActionsDropdownClick}
                    handleActionsDropdownClose={handleActionsDropdownClose}
                  />
                )}

                <ListAddField
                  text={`Add ${categoryName} subcategory`}
                  onClick={() => setCreateModalSubcategory(categoryId)}
                />
              </>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
