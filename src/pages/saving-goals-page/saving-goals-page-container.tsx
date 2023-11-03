import * as React from "react";
import { useSavingGoalsListQuery } from "../../generated/graphql";
import { SavingGoalsList } from "../../components/saving-goals-list/saving-goals-list";
import { ActionsBar } from "../../components/actions-bar/actions-bar";
import { ProminentButtonStyled } from "../../shared";
import SavingGoalFormFactory from "../../components/saving-goal-form-factory/saving-goal-form-factory";

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
        <ProminentButtonStyled onClick={() => setCreateModalSavingGoal(true)}>
          Add saving goal
        </ProminentButtonStyled>
        {createModalSavingGoal && (
          <SavingGoalFormFactory
            open={createModalSavingGoal}
            closeForm={() => {
              refetchSavingGoals();
              setCreateModalSavingGoal(false);
            }}
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
