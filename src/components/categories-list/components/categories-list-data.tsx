import { Fragment, FC, MouseEvent, useContext } from "react";
import { Category, Subcategory } from "@/generated/graphql";
import { UserContext } from "@/App";
import { formatAmount } from "@/utils/format";
import { AnchorActionDropdownElProps } from "@/hooks/useActionDropdown";
import { MainListItemStyled } from "@/shared";
import { CategorySubcategoriesList } from "./category-subcategories-list";
import { ListItemHeader } from "../../list-item-header/list-item-header";
import { ListAddField } from "../../list-add-field/list-add-field";
import { IconMenu } from "../../icon-menu/icon-menu";
import {
  CategoryAmountStyled,
  CategoryDetailsStyled,
} from "../categories-list-style";

interface Props {
  categories: Category[];
  openCategory: string;
  anchorActionDropdownEl: AnchorActionDropdownElProps;
  setOpenCategory: (categoryId: string) => void;
  setCreateModalSubcategory: (categoryId: string | null) => void;
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

export const CategoriesListData: FC<Props> = ({
  categories,
  openCategory,
  anchorActionDropdownEl,
  setOpenCategory,
  setCreateModalSubcategory,
  onEditCategory,
  onEditSubcategory,
  onRemoveCategory,
  onRemoveSubcategory,
  onActionsDropdownClick,
  onActionsDropdownClose,
}) => {
  const userCurrency = useContext(UserContext);

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
          <Fragment key={categoryId}>
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
                  handleOnEdit={() => onEditCategory(category)}
                  handleOnRemove={() => onRemoveCategory(categoryId)}
                  handleOnOpenMenu={(event: MouseEvent<HTMLElement>) =>
                    onActionsDropdownClick(event, categoryId)
                  }
                  handleOnCloseMenu={() => onActionsDropdownClose(categoryId)}
                />
              </CategoryDetailsStyled>
            </MainListItemStyled>

            {expanded && (
              <>
                {subcategories && (
                  <CategorySubcategoriesList
                    subcategories={subcategories}
                    anchorActionDropdownEl={anchorActionDropdownEl}
                    handleOnEditSubcategory={onEditSubcategory}
                    handleOnRemoveSubcategory={onRemoveSubcategory}
                    handleActionsDropdownClick={onActionsDropdownClick}
                    handleActionsDropdownClose={onActionsDropdownClose}
                  />
                )}

                <ListAddField
                  text={`Add ${categoryName} subcategory`}
                  onClick={() => setCreateModalSubcategory(categoryId)}
                />
              </>
            )}
          </Fragment>
        );
      })}
    </>
  );
};
