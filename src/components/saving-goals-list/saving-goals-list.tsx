import React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
                    <div>
                      <IconButton
                        id={`long-menu-icon-${savingGoalId}`}
                        aria-haspopup="true"
                        size="small"
                        onClick={(event) =>
                          handleActionsDropdownClick(event, savingGoalId)
                        }
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id={`long-menu-${savingGoalId}`}
                        anchorEl={anchorActionDropdownEl[savingGoalId]}
                        open={Boolean(anchorActionDropdownEl[savingGoalId])}
                        onClose={() => handleActionsDropdownClose(savingGoalId)}
                      >
                        <MenuItem
                          onClick={() => {
                            setUpdateModalSavingGoal(savingGoal);
                            handleActionsDropdownClose(savingGoalId);
                          }}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            deleteSavingGoal({
                              variables: { id: savingGoalId },
                            });
                            handleActionsDropdownClose(savingGoalId);
                          }}
                        >
                          Remove
                        </MenuItem>
                      </Menu>
                    </div>
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
