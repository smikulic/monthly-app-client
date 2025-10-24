import { useContext, useState } from "react";
import { useInvestmentsListQuery } from "@/generated/graphql";
import { UserContext } from "@/App";
import { ProminentButtonStyled } from "@/shared";
import { InvestmentsList, InvestmentFormFactory } from "@/features/investments";
import { ActionsBar } from "@/components/layout";
import { Typography } from "@/components/ui/Typography";
import { formatAmount } from "@/utils/format";
import { useInvestmentsActions } from "./use-investments-actions-hook";

export const InvestmentsPageContainer = () => {
  const userCurrency = useContext(UserContext);
  const [createModalInvestment, setCreateModalInvestment] = useState(false);

  const {
    data: investmentsData,
    loading: loadingInvestments,
    refetch: refetchInvestments,
  } = useInvestmentsListQuery();

  const {
    updateModalInvestment,
    anchorActionDropdownEl,
    setUpdateModalInvestment,
    handleEditInvestment,
    handleRemoveInvestment,
    handleActionsDropdownClick,
    handleActionsDropdownClose,
    calculatePercentageChange,
  } = useInvestmentsActions(refetchInvestments);

  const investments = investmentsData?.investments;

  // Calculate totals
  const totalInitialAmount =
    investments?.reduce(
      (sum, investment) => sum + investment.initialAmount,
      0
    ) || 0;

  const totalCurrentValue =
    investments?.reduce(
      (sum, investment) =>
        sum + (investment.amount || investment.initialAmount),
      0
    ) || 0;

  const totalGainLoss = totalCurrentValue - totalInitialAmount;
  const totalPercentageChange =
    totalInitialAmount > 0
      ? ((totalCurrentValue - totalInitialAmount) / totalInitialAmount) * 100
      : 0;

  return (
    <>
      <ActionsBar>
        <Typography variant="body1" color="text.primary">
          Net Worth: {formatAmount(totalCurrentValue, userCurrency)}
        </Typography>
        <ProminentButtonStyled onClick={() => setCreateModalInvestment(true)}>
          Add investment
        </ProminentButtonStyled>
        {createModalInvestment && (
          <InvestmentFormFactory
            open={createModalInvestment}
            closeForm={() => {
              refetchInvestments();
              setCreateModalInvestment(false);
            }}
          />
        )}
      </ActionsBar>
      <ActionsBar>
        <Typography variant="body1" color="text.secondary">
          Invested: {formatAmount(totalInitialAmount, userCurrency)}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: totalGainLoss >= 0 ? "success.main" : "error.main",
            fontWeight: 500,
          }}
        >
          {totalGainLoss >= 0 ? "+" : ""}
          {formatAmount(totalGainLoss, userCurrency)} (
          {totalPercentageChange >= 0 ? "+" : ""}
          {totalPercentageChange.toFixed(2)}%)
        </Typography>
      </ActionsBar>
      <InvestmentsList
        loading={loadingInvestments}
        investments={investments}
        anchorActionDropdownEl={anchorActionDropdownEl}
        onEditInvestment={handleEditInvestment}
        onRemoveInvestment={handleRemoveInvestment}
        onActionsDropdownClick={handleActionsDropdownClick}
        onActionsDropdownClose={handleActionsDropdownClose}
        calculatePercentageChange={calculatePercentageChange}
      />

      {updateModalInvestment && (
        <InvestmentFormFactory
          open={Boolean(updateModalInvestment)}
          closeForm={() => {
            refetchInvestments();
            setUpdateModalInvestment(null);
          }}
          formData={updateModalInvestment}
        />
      )}
    </>
  );
};
