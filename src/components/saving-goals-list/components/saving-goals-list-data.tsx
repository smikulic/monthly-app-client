import { Fragment, FC, MouseEvent, useContext } from "react";
import { SavingGoal } from "@/generated/graphql";
import { UserContext } from "@/App";
import { formatAmount } from "@/utils/format";
import { AnchorActionDropdownElProps } from "@/hooks/useActionDropdown";
import { MainListItemStyled } from "@/shared";
import { Box } from "@/components/ui/Box";
import { Typography } from "@/components/ui/Typography";
import { CategoryDetailsStyled } from "../../categories-list/categories-list-style";
import { SavingGoalItemDetails } from "../../saving-goal-item-details/saving-goal-item-details";
import { ProgressBar } from "../../progress-bar/progress-bar";
import { IconMenu } from "../../icon-menu/icon-menu";

interface Props {
  savingGoals: SavingGoal[];
  anchorActionDropdownEl: AnchorActionDropdownElProps;
  onEditSavingGoal: (savingGoal: SavingGoal) => void;
  onRemoveSavingGoal: (savingGoalId: string) => void;
  onActionsDropdownClick: (
    event: MouseEvent<HTMLElement>,
    anchorIndex: string
  ) => void;
  onActionsDropdownClose: (anchorIndex: string) => void;
  calculateSavingGoalData: (savingGoal: SavingGoal) => {
    monthsLeftToSave: number;
    savePerMonth: number;
    savedTillNow: number;
  };
}

export const SavingGoalsListData: FC<Props> = ({
  savingGoals,
  anchorActionDropdownEl,
  onEditSavingGoal,
  onRemoveSavingGoal,
  onActionsDropdownClick,
  onActionsDropdownClose,
  calculateSavingGoalData,
}) => {
  const userCurrency = useContext(UserContext);

  return (
    <>
      {savingGoals.map((savingGoal: SavingGoal) => {
        const savingGoalId = savingGoal.id;
        const { monthsLeftToSave, savePerMonth, savedTillNow } =
          calculateSavingGoalData(savingGoal);

        return (
          <Fragment key={savingGoalId}>
            <MainListItemStyled>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "210px",
                  }}
                >
                  <Typography variant="body1" color="text.primary">
                    {savingGoal.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="secondary">
                    {monthsLeftToSave <= 0 && (
                      <>You have saved up for your goal!</>
                    )}
                    {monthsLeftToSave > 0 && (
                      <>
                        {formatAmount(savePerMonth, userCurrency)}/month,{" "}
                        {monthsLeftToSave} months left
                      </>
                    )}
                  </Typography>
                </Box>
              </Box>

              <ProgressBar
                value={savedTillNow}
                maxValue={savingGoal.goalAmount}
                reverse
              />

              <Box sx={{ display: "flex" }}>
                <SavingGoalItemDetails
                  goalAmount={savingGoal.goalAmount}
                  savedTillNow={savedTillNow}
                />
                <CategoryDetailsStyled>
                  <IconMenu
                    itemId={savingGoalId}
                    anchorActionDropdownEl={anchorActionDropdownEl}
                    handleOnEdit={() => onEditSavingGoal(savingGoal)}
                    handleOnRemove={() => onRemoveSavingGoal(savingGoalId)}
                    handleOnOpenMenu={(event: MouseEvent<HTMLElement>) =>
                      onActionsDropdownClick(event, savingGoalId)
                    }
                    handleOnCloseMenu={() =>
                      onActionsDropdownClose(savingGoalId)
                    }
                  />
                </CategoryDetailsStyled>
              </Box>
            </MainListItemStyled>
          </Fragment>
        );
      })}
    </>
  );
};
