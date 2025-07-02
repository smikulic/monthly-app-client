import * as React from "react";
import { useInvestmentsListQuery } from "@/generated/graphql";
import { InvestmentsList } from "@/components/investments-list/investments-list";
import { ActionsBar } from "@/components/actions-bar/actions-bar";
import { ProminentButtonStyled } from "@/shared";
import InvestmentFormFactory from "@/components/investment-form-factory/investment-form-factory";
import { Box } from "@/components/ui/Box";
import { Typography } from "@/components/ui/Typography";
import { formatAmount } from "@/utils/format";
import { UserContext } from "@/App";

export const InvestmentsPageContainer = () => {
  const userCurrency = React.useContext(UserContext);
  const [createModalInvestment, setCreateModalInvestment] = React.useState(false);

  const {
    data: investmentsData,
    loading: loadingInvestments,
    refetch: refetchInvestments,
  } = useInvestmentsListQuery();

  const investments = investmentsData?.investments;

  // Calculate totals
  const totalInitialAmount = investments?.reduce(
    (sum, investment) => sum + investment.initialAmount,
    0
  ) || 0;
  
  const totalCurrentValue = investments?.reduce(
    (sum, investment) => sum + (investment.amount || investment.initialAmount),
    0
  ) || 0;
  
  const totalGainLoss = totalCurrentValue - totalInitialAmount;
  const totalPercentageChange = totalInitialAmount > 0
    ? ((totalCurrentValue - totalInitialAmount) / totalInitialAmount) * 100
    : 0;

  return (
    <>
      <ActionsBar>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="h6" color="text.primary">
            Total Value: {formatAmount(totalCurrentValue, userCurrency)}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Invested: {formatAmount(totalInitialAmount, userCurrency)}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: totalGainLoss >= 0 ? "success.main" : "error.main",
                fontWeight: 500 
              }}
            >
              {totalGainLoss >= 0 ? "+" : ""}
              {formatAmount(totalGainLoss, userCurrency)} ({totalPercentageChange >= 0 ? "+" : ""}{totalPercentageChange.toFixed(2)}%)
            </Typography>
          </Box>
        </Box>
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
      <InvestmentsList
        loading={loadingInvestments}
        investments={investments}
        refetchInvestments={refetchInvestments}
      />
    </>
  );
};