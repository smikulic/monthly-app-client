import React from "react";
import { Category, Maybe, Subcategory } from "../../../generated/graphql";
import { ListItemHeader } from "../../list-item-header/list-item-header";
import { MainListItemStyled, SubcategoryListItemStyled } from "../../../shared";
import {
  CategoryAmountStyled,
  CategoryDetailsStyled,
} from "../categories-list-style";
import { ListAddField } from "../../list-add-field/list-add-field";
import { formatAmount } from "../../../utils/format";
import { AnchorActionDropdownElProps } from "../../../hooks/useActionDropdown";
import { IconMenu } from "../../icon-menu/icon-menu";

interface Props {
  category: Category;
  categoryAmount: string;
  showSubcategories: boolean;
  anchorActionDropdownEl: AnchorActionDropdownElProps;
  onToggleExpand: () => void;
  handleOnEditCategory: () => void;
  handleOnRemoveCategory: () => void;
  handleOnEditSubcategory: (subcategory: Subcategory) => void;
  handleOnRemoveSubcategory: (subcategoryId: string) => void;
  handleOpenCreateSubcategory: () => void;
  handleActionsDropdownClick: (
    event: React.MouseEvent<HTMLElement>,
    anchorIndex: string
  ) => void;
  handleActionsDropdownClose: (anchorIndex: string) => void;
}

export const CategoryListItem: React.FC<Props> = ({
  category,
  categoryAmount,
  showSubcategories,
  anchorActionDropdownEl,
  onToggleExpand,
  handleOnEditCategory,
  handleOnRemoveCategory,
  handleOnEditSubcategory,
  handleOnRemoveSubcategory,
  handleOpenCreateSubcategory,
  handleActionsDropdownClick,
  handleActionsDropdownClose,
}) => {
  const categoryId = category.id;
  const categoryName = category.name;

  return (
    <>
      <MainListItemStyled active={showSubcategories}>
        <ListItemHeader
          title={categoryName}
          showExpand={!showSubcategories}
          showCollapse={showSubcategories}
          onToggleExpand={onToggleExpand}
        />
        <CategoryDetailsStyled>
          <CategoryAmountStyled>{categoryAmount}</CategoryAmountStyled>
          <IconMenu
            itemId={categoryId}
            anchorActionDropdownEl={anchorActionDropdownEl}
            handleOnEdit={handleOnEditCategory}
            handleOnRemove={handleOnRemoveCategory}
            handleOnOpenMenu={(event: React.MouseEvent<HTMLElement>) =>
              handleActionsDropdownClick(event, categoryId)
            }
            handleOnCloseMenu={() => handleActionsDropdownClose(categoryId)}
          />
        </CategoryDetailsStyled>
      </MainListItemStyled>
      {showSubcategories && (
        <>
          {!!category.subcategories &&
            category.subcategories.map((subcategory: Maybe<Subcategory>) => {
              if (!subcategory) return null;

              const subcategoryId = subcategory.id;

              return (
                <span key={subcategoryId}>
                  <SubcategoryListItemStyled>
                    <ListItemHeader title={subcategory.name} />
                    <CategoryDetailsStyled>
                      <CategoryAmountStyled>
                        {formatAmount(subcategory.budgetAmount || 0)}
                      </CategoryAmountStyled>
                      <IconMenu
                        itemId={subcategoryId}
                        anchorActionDropdownEl={anchorActionDropdownEl}
                        handleOnEdit={() =>
                          handleOnEditSubcategory(subcategory)
                        }
                        handleOnRemove={() =>
                          handleOnRemoveSubcategory(subcategoryId)
                        }
                        handleOnOpenMenu={(
                          event: React.MouseEvent<HTMLElement>
                        ) => handleActionsDropdownClick(event, subcategoryId)}
                        handleOnCloseMenu={() =>
                          handleActionsDropdownClose(subcategoryId)
                        }
                      />
                    </CategoryDetailsStyled>
                  </SubcategoryListItemStyled>
                </span>
              );
            })}

          <ListAddField
            text={`Add ${categoryName} subcategory`}
            onClick={handleOpenCreateSubcategory}
          />
        </>
      )}
    </>
  );
};
