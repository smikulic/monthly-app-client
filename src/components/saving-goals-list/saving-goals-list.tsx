import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { SavingGoal, useDeleteSavingGoalMutation } from "@/generated/graphql";
import { UserContext } from "@/App";
import { formatAmount } from "@/utils/format";
import { useActionDropdown } from "@/hooks/useActionDropdown";
import { MainListItemStyled } from "@/shared";
import { Box } from "@/components/ui/Box";
import { Typography } from "@/components/ui/Typography";
import { CategoryDetailsStyled } from "../categories-list/categories-list-style";
import { SavingGoalItemDetails } from "../saving-goal-item-details/saving-goal-item-details";
import { ProgressBar } from "../progress-bar/progress-bar";
import { IconMenu } from "../icon-menu/icon-menu";
import { ListLoading } from "@/components/ui/ListLoading";
import SavingGoalFormFactory from "../saving-goal-form-factory/saving-goal-form-factory";
import dayjs from "dayjs";
import { TOAST_MESSAGES, ENTITY_NAMES } from "@/constants/forms";

interface Props {
  loading: boolean;
  savingGoals?: SavingGoal[];
  refetchSavingGoals: () => Promise<unknown>;
}

export const SavingGoalsList: React.FC<Props> = ({
  loading,
  savingGoals,
  refetchSavingGoals,
}) => {
  const userCurrency = useContext(UserContext);

  const {
    anchorActionDropdownEl,
    handleActionsDropdownClick,
    handleActionsDropdownClose,
  } = useActionDropdown();

  const [updateModalSavingGoal, setUpdateModalSavingGoal] =
    useState<SavingGoal | null>(null);

  const [deleteSavingGoal] = useDeleteSavingGoalMutation({
    onError: () => {
      toast.error(TOAST_MESSAGES.ERROR.DELETE(ENTITY_NAMES.SAVING_GOAL));
    },
    onCompleted: ({ deleteSavingGoal }) => {
      refetchSavingGoals();
      toast.success(
        TOAST_MESSAGES.SUCCESS.DELETE(
          ENTITY_NAMES.SAVING_GOAL,
          deleteSavingGoal.name
        )
      );
    },
  });

  return (
    <div>
      {loading && (
        <ListLoading height={44} itemCount={3} showDetails showActions />
      )}
      {!loading && (!savingGoals || savingGoals.length === 0) && (
        <MainListItemStyled>No saving goals</MainListItemStyled>
      )}
      {!loading &&
        savingGoals?.map((savingGoal: SavingGoal) => {
          const savingGoalId = savingGoal.id;

          const currentDate = new Date();
          const goalStartDate = new Date(Number(savingGoal.createdAt));
          const goalEndDate = new Date(Number(savingGoal.goalDate));
          const savingRangeInMonths = dayjs(goalEndDate).diff(
            dayjs(goalStartDate),
            "month"
          );
          const monthsSaving = dayjs(currentDate).diff(
            dayjs(goalStartDate),
            "month"
          );

          const monthsLeftToSave = savingRangeInMonths - monthsSaving;

          const savePerMonth =
            (savingGoal.goalAmount - (savingGoal.initialSaveAmount || 0)) /
            savingRangeInMonths;

          const savedTillNow =
            (savingGoal.initialSaveAmount || 0) + savePerMonth * monthsSaving;

          return (
            <React.Fragment key={savingGoalId}>
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
                      handleOnEdit={() => {
                        setUpdateModalSavingGoal(savingGoal);
                        handleActionsDropdownClose(savingGoalId);
                      }}
                      handleOnRemove={() => {
                        deleteSavingGoal({
                          variables: { id: savingGoalId },
                        });
                        handleActionsDropdownClose(savingGoalId);
                      }}
                      handleOnOpenMenu={(
                        event: React.MouseEvent<HTMLElement>
                      ) => handleActionsDropdownClick(event, savingGoalId)}
                      handleOnCloseMenu={() =>
                        handleActionsDropdownClose(savingGoalId)
                      }
                    />
                  </CategoryDetailsStyled>
                </Box>
              </MainListItemStyled>
            </React.Fragment>
          );
        })}

      {updateModalSavingGoal && (
        <SavingGoalFormFactory
          open={Boolean(updateModalSavingGoal)}
          closeForm={() => {
            refetchSavingGoals();
            setUpdateModalSavingGoal(null);
          }}
          formData={updateModalSavingGoal}
        />
      )}
    </div>
  );
};
