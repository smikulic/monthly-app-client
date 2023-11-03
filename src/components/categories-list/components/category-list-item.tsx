import React from "react";
import { ListItemHeader } from "../../list-item-header/list-item-header";
import { MainListItemStyled } from "../../../shared";
import {
  CategoryAmountStyled,
  CategoryDetailsStyled,
} from "../categories-list-style";
import { AnchorActionDropdownElProps } from "../../../hooks/useActionDropdown";
import { IconMenu } from "../../icon-menu/icon-menu";

interface Props {
  categoryId: string;
  categoryName: string;
  categoryAmount: string;
  expanded: boolean;
  anchorActionDropdownEl: AnchorActionDropdownElProps;
  onToggleExpand: () => void;
  handleOnEditCategory: () => void;
  handleOnRemoveCategory: () => void;
  handleOnOpenMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleOnCloseMenu: () => void;
}

export const CategoryListItem: React.FC<Props> = ({
  categoryId,
  categoryName,
  categoryAmount,
  expanded,
  anchorActionDropdownEl,
  onToggleExpand,
  handleOnEditCategory,
  handleOnRemoveCategory,
  handleOnOpenMenu,
  handleOnCloseMenu,
}) => {
  return (
    <>
      <MainListItemStyled active={expanded}>
        <ListItemHeader
          title={categoryName}
          showExpand={!expanded}
          showCollapse={expanded}
          onToggleExpand={onToggleExpand}
        />
        <CategoryDetailsStyled>
          <CategoryAmountStyled>{categoryAmount}</CategoryAmountStyled>
          <IconMenu
            itemId={categoryId}
            anchorActionDropdownEl={anchorActionDropdownEl}
            handleOnEdit={handleOnEditCategory}
            handleOnRemove={handleOnRemoveCategory}
            handleOnOpenMenu={handleOnOpenMenu}
            handleOnCloseMenu={handleOnCloseMenu}
          />
        </CategoryDetailsStyled>
      </MainListItemStyled>
    </>
  );
};
