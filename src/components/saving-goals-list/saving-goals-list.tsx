import React from "react";
import { differenceInCalendarMonths } from "date-fns";
import {
  SavingGoal,
  useDeleteSavingGoalMutation,
} from "../../generated/graphql";
import { toast } from "react-toastify";
import { useActionDropdown } from "../../hooks/useActionDropdown";
import { MainListItemStyled } from "../../shared";
import { formatAmount } from "../../utils/format";
import { Box, Skeleton, Typography } from "@mui/material";
import { CategoryDetailsStyled } from "../categories-list/categories-list-style";
import { UpdateSavingGoalForm } from "../update-saving-goal-form/update-saving-goal-form";
import { SavingGoalItemDetails } from "../saving-goal-item-details/saving-goal-item-details";
import { ProgressBar } from "../progress-bar/progress-bar";
import { IconMenu } from "../icon-menu/icon-menu";

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
  const {
    anchorActionDropdownEl,
    handleActionsDropdownClick,
    handleActionsDropdownClose,
  } = useActionDropdown();

  const [updateModalSavingGoal, setUpdateModalSavingGoal] =
    React.useState<SavingGoal | null>(null);

  const [deleteSavingGoal] = useDeleteSavingGoalMutation({
    onError: () => {
      toast.error(`There was an error while removing saving goal!`);
    },
    onCompleted: ({ deleteSavingGoal }) => {
      refetchSavingGoals();
      toast.success(
        `You have successfully removed ${deleteSavingGoal.name} saving goal!`
      );
    },
  });

  return (
    <div>
      {loading && (
        <>
          <MainListItemStyled>
            <Skeleton animation="wave" width={200} height={20} />
            <CategoryDetailsStyled>
              <Skeleton animation="wave" width={60} height={20} />
            </CategoryDetailsStyled>
          </MainListItemStyled>
          <MainListItemStyled>
            <Skeleton animation="wave" width={200} height={20} />
            <CategoryDetailsStyled>
              <Skeleton animation="wave" width={60} height={20} />
            </CategoryDetailsStyled>
          </MainListItemStyled>
          <MainListItemStyled>
            <Skeleton animation="wave" width={200} height={20} />
            <CategoryDetailsStyled>
              <Skeleton animation="wave" width={60} height={20} />
            </CategoryDetailsStyled>
          </MainListItemStyled>
        </>
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
          const savingRangeInMonths = differenceInCalendarMonths(
            goalEndDate,
            goalStartDate
          );
          const monthsSaving = differenceInCalendarMonths(
            currentDate,
            goalStartDate
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
                          {formatAmount(savePerMonth)}/month, {monthsLeftToSave}{" "}
                          months left
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
        <UpdateSavingGoalForm
          open={Boolean(updateModalSavingGoal)}
          formData={updateModalSavingGoal}
          closeForm={() => setUpdateModalSavingGoal(null)}
          refetch={refetchSavingGoals}
        />
      )}
    </div>
  );
};
