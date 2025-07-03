import { FC, MouseEvent, useContext } from "react";
import { Maybe, Subcategory } from "@/generated/graphql";
import { UserContext } from "@/App";
import { formatAmount } from "@/utils/format";
import { AnchorActionDropdownElProps } from "@/hooks/useActionDropdown";
import { SubcategoryListItemStyled } from "@/shared";
import { ListItemHeader } from "../../list-item-header/list-item-header";
import { IconMenu } from "../../icon-menu/icon-menu";
import {
  CategoryAmountStyled,
  CategoryDetailsStyled,
} from "../categories-list-style";

interface Props {
  subcategories: Subcategory[];
  anchorActionDropdownEl: AnchorActionDropdownElProps;
  handleOnEditSubcategory: (subcategory: Subcategory) => void;
  handleOnRemoveSubcategory: (subcategoryId: string) => void;
  handleActionsDropdownClick: (
    event: MouseEvent<HTMLElement>,
    anchorIndex: string
  ) => void;
  handleActionsDropdownClose: (anchorIndex: string) => void;
}

export const CategorySubcategoriesList: FC<Props> = ({
  subcategories,
  anchorActionDropdownEl,
  handleOnEditSubcategory,
  handleOnRemoveSubcategory,
  handleActionsDropdownClick,
  handleActionsDropdownClose,
}) => {
  const userCurrency = useContext(UserContext);

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
                  handleOnOpenMenu={(event: MouseEvent<HTMLElement>) =>
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
