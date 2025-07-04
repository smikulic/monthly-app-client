import { useState } from "react";
import { useSavingGoalsListQuery } from "@/generated/graphql";
import { ProminentButtonStyled } from "@/shared";
import {
  SavingGoalsList,
  SavingGoalFormFactory,
} from "@/features/saving-goals";
import { ActionsBar } from "@/components/layout";
import { useSavingGoalsActions } from "./use-saving-goals-actions-hook";

export const SavingGoalsPageContainer = () => {
  const [createModalSavingGoal, setCreateModalSavingGoal] = useState(false);

  const {
    data: savingGoalsData,
    loading: loadingSavingGoals,
    refetch: refetchSavingGoals,
  } = useSavingGoalsListQuery();

  const {
    updateModalSavingGoal,
    anchorActionDropdownEl,
    setUpdateModalSavingGoal,
    handleEditSavingGoal,
    handleRemoveSavingGoal,
    handleActionsDropdownClick,
    handleActionsDropdownClose,
    calculateSavingGoalData,
  } = useSavingGoalsActions(refetchSavingGoals);

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
        anchorActionDropdownEl={anchorActionDropdownEl}
        onEditSavingGoal={handleEditSavingGoal}
        onRemoveSavingGoal={handleRemoveSavingGoal}
        onActionsDropdownClick={handleActionsDropdownClick}
        onActionsDropdownClose={handleActionsDropdownClose}
        calculateSavingGoalData={calculateSavingGoalData}
      />

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
    </>
  );
};
