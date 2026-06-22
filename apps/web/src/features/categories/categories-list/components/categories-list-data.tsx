import { FC, MouseEvent, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Category, Subcategory } from "@/generated/graphql";
import { UserContext } from "@/App";
import { formatAmount } from "@/utils/format";
import { AnchorActionDropdownElProps } from "@/hooks/useActionDropdown";
import {
  GroupCardStyled,
  GroupHeaderRowStyled,
  GroupAddRowStyled,
} from "@/components/list-group/list-group-style";
import { CategorySubcategoriesList } from "./category-subcategories-list";
import { ListItemHeader } from "@/components/list-item-header/list-item-header";
import { IconMenu } from "@/components/icon-menu/icon-menu";
import { CategoryShareMenuItems } from "@/features/groups/category-share-control";
import { SharedGroupBadge } from "@/features/groups/shared-group-badge";
import { useCanManage } from "@/features/groups/use-can-manage";
import { useScope } from "@/features/groups/scope-context";
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
    anchorIndex: string,
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
  const canManage = useCanManage();
  const { mode } = useScope();

  return (
    <>
      {categories.map((category: Category) => {
        const categoryId = category.id;
        const categoryName = category.name;
        const expanded = openCategory === categoryId;
        const subcategories = category.subcategories as Subcategory[];
        const manageable = canManage(category.user?.id, category.groupId);

        const initialValue = 0;
        const totalBudgetAmount = subcategories.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue?.budgetAmount!,
          initialValue,
        );

        return (
          <GroupCardStyled key={categoryId} active={expanded}>
            <GroupHeaderRowStyled>
              <ListItemHeader
                title={categoryName}
                showExpand={!expanded}
                showCollapse={expanded}
                onToggleExpand={() =>
                  setOpenCategory(expanded ? "" : categoryId)
                }
                badge={
                  mode === "ALL" ? (
                    <SharedGroupBadge groupId={category.groupId} />
                  ) : undefined
                }
              />
              <CategoryDetailsStyled>
                <CategoryAmountStyled>
                  {formatAmount(totalBudgetAmount || 0, userCurrency)}
                </CategoryAmountStyled>
                {manageable && (
                  <IconMenu
                    itemId={categoryId}
                    anchorActionDropdownEl={anchorActionDropdownEl}
                    handleOnEdit={() => onEditCategory(category)}
                    handleOnRemove={() => onRemoveCategory(categoryId)}
                    handleOnOpenMenu={(event: MouseEvent<HTMLElement>) =>
                      onActionsDropdownClick(event, categoryId)
                    }
                    handleOnCloseMenu={() => onActionsDropdownClose(categoryId)}
                    extraItems={
                      <CategoryShareMenuItems
                        categoryId={categoryId}
                        groupId={category.groupId}
                        creatorId={category.user?.id}
                        onDone={() => onActionsDropdownClose(categoryId)}
                      />
                    }
                  />
                )}
              </CategoryDetailsStyled>
            </GroupHeaderRowStyled>

            {expanded && (
              <>
                {subcategories && (
                  <CategorySubcategoriesList
                    subcategories={subcategories}
                    canManage={manageable}
                    anchorActionDropdownEl={anchorActionDropdownEl}
                    handleOnEditSubcategory={onEditSubcategory}
                    handleOnRemoveSubcategory={onRemoveSubcategory}
                    handleActionsDropdownClick={onActionsDropdownClick}
                    handleActionsDropdownClose={onActionsDropdownClose}
                  />
                )}

                <GroupAddRowStyled
                  onClick={() => setCreateModalSubcategory(categoryId)}
                >
                  <AddIcon />
                  Add subcategory
                </GroupAddRowStyled>
              </>
            )}
          </GroupCardStyled>
        );
      })}
    </>
  );
};
