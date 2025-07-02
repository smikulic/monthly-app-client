import React, { useState } from "react";
import { toast } from "react-toastify";
import { Investment, useDeleteInvestmentMutation } from "@/generated/graphql";
import { MainListItemStyled } from "@/shared";
import { useActionDropdown } from "@/hooks/useActionDropdown";
import { Box } from "@/components/ui/Box";
import { Typography } from "@/components/ui/Typography";
import { CategoryDetailsStyled } from "../categories-list/categories-list-style";
import { InvestmentItemDetails } from "../investment-item-details/investment-item-details";
import { IconMenu } from "../icon-menu/icon-menu";
import { ListLoading } from "@/components/ui/ListLoading";
import InvestmentFormFactory from "../investment-form-factory/investment-form-factory";
// import { InvestmentDateStyled } from "../investment-item-details/investment-item-details-style";
import dayjs from "dayjs";
import { TOAST_MESSAGES, ENTITY_NAMES } from "@/constants/forms";

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

  const calculatePercentageChange = (initial: number, current: number) => {
    if (initial === 0) return 0;
    return ((current - initial) / initial) * 100;
  };

  return (
    <div>
      {loading && (
        <ListLoading height={44} itemCount={3} showDetails showActions />
      )}
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
                    <Typography variant="body2" color="secondary">
                      , Held:{" "}
                      {dayjs()
                        .diff(dayjs(Number(investment.startDate)), "year", true) // get fractional years
                        .toFixed(1)
                        .replace(/\.0$/, "")}{" "}
                      years
                    </Typography>
                    {/* <InvestmentDateStyled>
                    Since{" "}
                      {dayjs(Number(investment.startDate)).format("MMM YYYY")}
                    </InvestmentDateStyled> */}
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
                  {/* <Typography
                    variant="body2"
                    sx={{
                      color: isPositive ? "success.main" : "error.main",
                      paddingRight: "8px",
                    }}
                  >
                    {isPositive ? "+" : ""}
                    {percentageChange.toFixed(2)}%
                  </Typography> */}
                </Box>

                <Box sx={{ display: "flex" }}>
                  <InvestmentItemDetails
                    initialAmount={investment.initialAmount}
                    currentAmount={currentValue}
                    percentageChange={percentageChange}
                    currency={investment.currency}
                    isPositive={isPositive}
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
