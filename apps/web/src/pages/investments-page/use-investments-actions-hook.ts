import { useState } from "react";
import { toast } from "react-toastify";
import { Investment, useDeleteInvestmentMutation } from "@/generated/graphql";
import { useActionDropdown } from "@/hooks/useActionDropdown";
import { TOAST_MESSAGES, ENTITY_NAMES } from "@/constants/forms";

export const useInvestmentsActions = (
  refetchInvestments: () => Promise<unknown>
) => {
  const {
    anchorActionDropdownEl,
    handleActionsDropdownClick,
    handleActionsDropdownClose,
  } = useActionDropdown();

  const [updateModalInvestment, setUpdateModalInvestment] =
    useState<Investment | null>(null);

  const [deleteInvestment] = useDeleteInvestmentMutation({
    onError: () => {
      toast.error(TOAST_MESSAGES.ERROR.DELETE(ENTITY_NAMES.INVESTMENT));
    },
    onCompleted: () => {
      refetchInvestments();
      toast.success(TOAST_MESSAGES.SUCCESS.DELETE(ENTITY_NAMES.INVESTMENT));
    },
  });

  const handleEditInvestment = (investment: Investment) => {
    setUpdateModalInvestment(investment);
    handleActionsDropdownClose(investment.id);
  };

  const handleRemoveInvestment = (investmentId: string) => {
    deleteInvestment({ variables: { id: investmentId } });
    handleActionsDropdownClose(investmentId);
  };

  const calculatePercentageChange = (initial: number, current: number) => {
    if (initial === 0) return 0;
    return ((current - initial) / initial) * 100;
  };

  return {
    // State
    updateModalInvestment,
    anchorActionDropdownEl,

    // Actions
    setUpdateModalInvestment,
    handleEditInvestment,
    handleRemoveInvestment,
    handleActionsDropdownClick,
    handleActionsDropdownClose,

    // Utilities
    calculatePercentageChange,
  };
};
