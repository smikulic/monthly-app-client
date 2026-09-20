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
      {/* `toolbar` with no scope or month of its own, so the action lands on
          the same bottom bar as Add category and Add expense instead of at the
          top of a scrolling list. */}
      <ActionsBar toolbar>
        <ProminentButtonStyled
          small
          onClick={() => setCreateModalSavingGoal(true)}
          data-testid="add-saving-goal-button"
        >
          Add saving goal
        </ProminentButtonStyled>
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

      {/* Dialogs are siblings of the toolbar, as on the categories page. They
          were nested inside it, which only worked because they portal out. */}
      {createModalSavingGoal && (
        <SavingGoalFormFactory
          open={createModalSavingGoal}
          closeForm={() => {
            refetchSavingGoals();
            setCreateModalSavingGoal(false);
          }}
        />
      )}
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
