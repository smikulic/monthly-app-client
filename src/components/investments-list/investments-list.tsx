import React from "react";
import { toast } from "react-toastify";
import { Investment, useDeleteInvestmentMutation } from "@/generated/graphql";
import { UserContext } from "@/App";
import { formatAmount } from "@/utils/format";
import { useActionDropdown } from "@/hooks/useActionDropdown";
import { MainListItemStyled } from "@/shared";
import { Box } from "@/components/ui/Box";
import { Typography } from "@/components/ui/Typography";
import { CategoryDetailsStyled } from "../categories-list/categories-list-style";
import { InvestmentItemDetails } from "../investment-item-details/investment-item-details";
import { IconMenu } from "../icon-menu/icon-menu";
import { CategoriesListLoading } from "../categories-list/components/categories-list-loading";
import InvestmentFormFactory from "../investment-form-factory/investment-form-factory";

interface Props {
  loading: boolean;
  investments?: Investment[];
  refetchInvestments: () => Promise<unknown>;
}

export const InvestmentsList: React.FC<Props> = ({
  loading,
  investments,
  refetchInvestments,
}) => {
  const userCurrency = React.useContext(UserContext);

  const {
    anchorActionDropdownEl,
    handleActionsDropdownClick,
    handleActionsDropdownClose,
  } = useActionDropdown();

  const [updateModalInvestment, setUpdateModalInvestment] = React.useState<Investment | null>(
    null
  );

  const [deleteInvestment] = useDeleteInvestmentMutation({
    onError: () => {
      toast.error(`There was an error while removing investment!`);
    },
    onCompleted: () => {
      refetchInvestments();
      toast.success(`You have successfully removed the investment!`);
    },
  });

  const calculatePercentageChange = (initial: number, current: number) => {
    if (initial === 0) return 0;
    return ((current - initial) / initial) * 100;
  };

  return (
    <div>
      {loading && <CategoriesListLoading height={44} />}
      {!loading && (!investments || investments.length === 0) && (
        <MainListItemStyled>No investments</MainListItemStyled>
      )}
      {!loading &&
        investments?.map((investment: Investment) => {
          const investmentId = investment.id;
          const currentValue = investment.amount || investment.initialAmount;
          const percentageChange = calculatePercentageChange(
            investment.initialAmount,
            currentValue
          );
          const isPositive = percentageChange >= 0;

          return (
            <React.Fragment key={investmentId}>
              <MainListItemStyled>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "210px",
                    }}
                  >
                    <Typography variant="body1" color="text.primary">
                      {investment.name}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="secondary">
                      Qty: {investment.quantity}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    flex: 1,
                  }}
                >
                  <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{ fontWeight: 500 }}
                  >
                    {formatAmount(currentValue, investment.currency)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isPositive ? "success.main" : "error.main",
                    }}
                  >
                    {isPositive ? "+" : ""}
                    {percentageChange.toFixed(2)}%
                  </Typography>
                </Box>

                <Box sx={{ display: "flex" }}>
                  <InvestmentItemDetails
                    initialAmount={investment.initialAmount}
                    currentAmount={currentValue}
                    startDate={investment.startDate}
                    currency={investment.currency}
                  />
                  <CategoryDetailsStyled>
                    <IconMenu
                      itemId={investmentId}
                      anchorActionDropdownEl={anchorActionDropdownEl}
                      handleOnEdit={() => {
                        setUpdateModalInvestment(investment);
                        handleActionsDropdownClose(investmentId);
                      }}
                      handleOnRemove={() => {
                        deleteInvestment({
                          variables: { id: investmentId },
                        });
                        handleActionsDropdownClose(investmentId);
                      }}
                      handleOnOpenMenu={(
                        event: React.MouseEvent<HTMLElement>
                      ) => handleActionsDropdownClick(event, investmentId)}
                      handleOnCloseMenu={() =>
                        handleActionsDropdownClose(investmentId)
                      }
                    />
                  </CategoryDetailsStyled>
                </Box>
              </MainListItemStyled>
            </React.Fragment>
          );
        })}

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
    </div>
  );
};