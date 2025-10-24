import { useState } from "react";
import { toast } from "react-toastify";
import { SavingGoal, useDeleteSavingGoalMutation } from "@/generated/graphql";
import { useActionDropdown } from "@/hooks/useActionDropdown";
import { TOAST_MESSAGES, ENTITY_NAMES } from "@/constants/forms";
import dayjs from "dayjs";

export const useSavingGoalsActions = (
  refetchSavingGoals: () => Promise<unknown>
) => {
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

    // Calculate total months from start to goal date
    const totalSavingMonths = dayjs(goalEndDate).diff(
      dayjs(goalStartDate),
      "month"
    );

    // Calculate months elapsed since start
    const monthsElapsed = Math.max(
      0,
      dayjs(currentDate).diff(dayjs(goalStartDate), "month")
    );

    // Calculate months remaining (can't be negative)
    const monthsLeftToSave = Math.max(0, totalSavingMonths - monthsElapsed);

    // Calculate required monthly savings (excluding initial amount)
    const remainingAmount =
      savingGoal.goalAmount - (savingGoal.initialSaveAmount || 0);
    const savePerMonth =
      totalSavingMonths > 0 ? remainingAmount / totalSavingMonths : 0;

    // Calculate expected savings by now (initial + monthly savings * months elapsed)
    const expectedSavingsByNow =
      (savingGoal.initialSaveAmount || 0) + savePerMonth * monthsElapsed;

    // Ensure we don't exceed the goal amount
    const savedTillNow = Math.min(expectedSavingsByNow, savingGoal.goalAmount);

    return {
      monthsLeftToSave,
      savePerMonth: Math.max(0, savePerMonth),
      savedTillNow: Math.max(savingGoal.initialSaveAmount || 0, savedTillNow),
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
