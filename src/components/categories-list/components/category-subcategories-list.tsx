import React from "react";
import { Maybe, Subcategory } from "../../../generated/graphql";
import { SubcategoryListItemStyled } from "../../../shared";
import { ListItemHeader } from "../../list-item-header/list-item-header";
import { formatAmount } from "../../../utils/format";
import { AnchorActionDropdownElProps } from "../../../hooks/useActionDropdown";
import {
  CategoryAmountStyled,
  CategoryDetailsStyled,
} from "../categories-list-style";
import { IconMenu } from "../../icon-menu/icon-menu";
import { UserContext } from "../../../App";

interface Props {
  subcategories: Subcategory[];
  anchorActionDropdownEl: AnchorActionDropdownElProps;
  handleOnEditSubcategory: (subcategory: Subcategory) => void;
  handleOnRemoveSubcategory: (subcategoryId: string) => void;
  handleActionsDropdownClick: (
    event: React.MouseEvent<HTMLElement>,
    anchorIndex: string
  ) => void;
  handleActionsDropdownClose: (anchorIndex: string) => void;
}

export const CategorySubcategoriesList: React.FC<Props> = ({
  subcategories,
  anchorActionDropdownEl,
  handleOnEditSubcategory,
  handleOnRemoveSubcategory,
  handleActionsDropdownClick,
  handleActionsDropdownClose,
}) => {
  const userCurrency = React.useContext(UserContext);

  return (
    <>
      {subcategories.map((subcategory: Maybe<Subcategory>) => {
        if (!subcategory) return null;

        const subcategoryId = subcategory.id;

        return (
          <span key={subcategoryId}>
            <SubcategoryListItemStyled>
              <ListItemHeader title={subcategory.name} />
              <CategoryDetailsStyled>
                <CategoryAmountStyled>
                  {formatAmount(subcategory.budgetAmount || 0, userCurrency)}
                </CategoryAmountStyled>
                <IconMenu
                  itemId={subcategoryId}
                  anchorActionDropdownEl={anchorActionDropdownEl}
                  handleOnEdit={() => handleOnEditSubcategory(subcategory)}
                  handleOnRemove={() =>
                    handleOnRemoveSubcategory(subcategoryId)
                  }
                  handleOnOpenMenu={(event: React.MouseEvent<HTMLElement>) =>
                    handleActionsDropdownClick(event, subcategoryId)
                  }
                  handleOnCloseMenu={() =>
                    handleActionsDropdownClose(subcategoryId)
                  }
                />
              </CategoryDetailsStyled>
            </SubcategoryListItemStyled>
          </span>
        );
      })}
    </>
  );
};
