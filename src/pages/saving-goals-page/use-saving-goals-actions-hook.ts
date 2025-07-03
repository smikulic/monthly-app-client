import { useState } from "react";
import { toast } from "react-toastify";
import { SavingGoal, useDeleteSavingGoalMutation } from "@/generated/graphql";
import { useActionDropdown } from "@/hooks/useActionDropdown";
import { TOAST_MESSAGES, ENTITY_NAMES } from "@/constants/forms";
import dayjs from "dayjs";

export const useSavingGoalsActions = (refetchSavingGoals: () => Promise<unknown>) => {
  const {
    anchorActionDropdownEl,
    handleActionsDropdownClick,
    handleActionsDropdownClose,
  } = useActionDropdown();

  const [updateModalSavingGoal, setUpdateModalSavingGoal] = useState<SavingGoal | null>(null);

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

  const handleEditSavingGoal = (savingGoal: SavingGoal) => {
    setUpdateModalSavingGoal(savingGoal);
    handleActionsDropdownClose(savingGoal.id);
  };

  const handleRemoveSavingGoal = (savingGoalId: string) => {
    deleteSavingGoal({ variables: { id: savingGoalId } });
    handleActionsDropdownClose(savingGoalId);
  };

  const calculateSavingGoalData = (savingGoal: SavingGoal) => {
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

    return {
      monthsLeftToSave,
      savePerMonth,
      savedTillNow,
    };
  };

  return {
    // State
    updateModalSavingGoal,
    anchorActionDropdownEl,
    
    // Actions
    setUpdateModalSavingGoal,
    handleEditSavingGoal,
    handleRemoveSavingGoal,
    handleActionsDropdownClick,
    handleActionsDropdownClose,
    
    // Utilities
    calculateSavingGoalData,
  };
};