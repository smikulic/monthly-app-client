import { Fragment, FC, MouseEvent } from "react";
import dayjs from "dayjs";
import { Investment } from "@/generated/graphql";
import { MainListItemStyled } from "@/shared";
import { AnchorActionDropdownElProps } from "@/hooks/useActionDropdown";
import { Box } from "@/components/ui/Box";
import { Typography } from "@/components/ui/Typography";
import { CategoryDetailsStyled } from "@/features/categories/categories-list/categories-list-style";
import { InvestmentItemDetails } from "../../investment-item-details/investment-item-details";
import { IconMenu } from "@/components/icon-menu/icon-menu";

interface Props {
  investments: Investment[];
  anchorActionDropdownEl: AnchorActionDropdownElProps;
  onEditInvestment: (investment: Investment) => void;
  onRemoveInvestment: (investmentId: string) => void;
  onActionsDropdownClick: (
    event: MouseEvent<HTMLElement>,
    anchorIndex: string
  ) => void;
  onActionsDropdownClose: (anchorIndex: string) => void;
  calculatePercentageChange: (initial: number, current: number) => number;
}

export const InvestmentsListData: FC<Props> = ({
  investments,
  anchorActionDropdownEl,
  onEditInvestment,
  onRemoveInvestment,
  onActionsDropdownClick,
  onActionsDropdownClose,
  calculatePercentageChange,
}) => {
  return (
    <>
      {investments.map((investment: Investment) => {
        const investmentId = investment.id;
        const currentValue = investment.amount || investment.initialAmount;
        const percentageChange = calculatePercentageChange(
          investment.initialAmount,
          currentValue
        );
        const isPositive = percentageChange >= 0;

        return (
          <Fragment key={investmentId}>
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
                  {/* Since{" "}
                    {dayjs(Number(investment.startDate)).format("MMM YYYY")} */}
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
                    handleOnEdit={() => onEditInvestment(investment)}
                    handleOnRemove={() => onRemoveInvestment(investmentId)}
                    handleOnOpenMenu={(event: MouseEvent<HTMLElement>) =>
                      onActionsDropdownClick(event, investmentId)
                    }
                    handleOnCloseMenu={() =>
                      onActionsDropdownClose(investmentId)
                    }
                  />
                </CategoryDetailsStyled>
              </Box>
            </MainListItemStyled>
          </Fragment>
        );
      })}
    </>
  );
};
