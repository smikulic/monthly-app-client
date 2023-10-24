import React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  SavingGoal,
  useDeleteSavingGoalMutation,
} from "../../generated/graphql";
import { toast } from "react-toastify";
import { useActionDropdown } from "../../hooks/useActionDropdown";
import { ListItemHeader } from "../list-item-header/list-item-header";
import { MainListItemStyled } from "../../shared";
import { formatAmount } from "../../utils/format";
import { Skeleton } from "@mui/material";
import {
  CategoryAmountStyled,
  CategoryDetailsStyled,
} from "../categories-list/categories-list-style";
import { UpdateSavingGoalForm } from "../update-saving-goal-form/update-saving-goal-form";

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

  console.log({ savingGoals });

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

          return (
            <React.Fragment key={savingGoalId}>
              <MainListItemStyled>
                <ListItemHeader title={savingGoal.name} />
                <CategoryDetailsStyled>
                  <CategoryAmountStyled>
                    {formatAmount(savingGoal.goalAmount)}
                  </CategoryAmountStyled>
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
                          deleteSavingGoal({ variables: { id: savingGoalId } });
                          handleActionsDropdownClose(savingGoalId);
                        }}
                      >
                        Remove
                      </MenuItem>
                    </Menu>
                  </div>
                </CategoryDetailsStyled>
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
