import * as React from "react";
import Button from "@mui/material/Button";
import { useSavingGoalsListQuery } from "../../generated/graphql";
import { SavingGoalsList } from "../../components/saving-goals-list/saving-goals-list";
import { ActionsBar } from "../../components/actions-bar/actions-bar";
import { CreateSavingGoalForm } from "../../components/create-saving-goal-form/create-saving-goal-form";

export const SavingGoalsPageContainer = () => {
  const [createModalSavingGoal, setCreateModalSavingGoal] =
    React.useState(false);

  const {
    data: savingGoalsData,
    loading: loadingSavingGoals,
    refetch: refetchSavingGoals,
  } = useSavingGoalsListQuery();

  const savingGoals = savingGoalsData?.savingGoals;

  return (
    <>
      <ActionsBar>
        {/* Empty span to push button to the right */}
        <span></span>
        <Button
          variant="contained"
          onClick={() => setCreateModalSavingGoal(true)}
        >
          Add saving goal
        </Button>
        {createModalSavingGoal && (
          <CreateSavingGoalForm
            open={createModalSavingGoal}
            closeForm={() => setCreateModalSavingGoal(false)}
            refetch={refetchSavingGoals}
          />
        )}
      </ActionsBar>
      <SavingGoalsList
        loading={loadingSavingGoals}
        savingGoals={savingGoals}
        refetchSavingGoals={refetchSavingGoals}
      />
    </>
  );
};
