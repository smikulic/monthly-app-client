import React from "react";
import {
  InvestmentInitialAmountStyled,
  InvestmentCurrentValueStyled,
  InvestmentItemDetailsContainerStyled,
} from "./investment-item-details-style";
import { formatAmount } from "@/utils/format";

interface Props {
  initialAmount: number;
  currentAmount: number;
  percentageChange: number;
  currency: string;
  isPositive: boolean;
}

export const InvestmentItemDetails: React.FC<Props> = ({
  initialAmount,
  currentAmount,
  percentageChange,
  currency,
  isPositive,
}) => {
  const gainLoss = currentAmount - initialAmount;

  return (
    <InvestmentItemDetailsContainerStyled>
      <InvestmentCurrentValueStyled positive={isPositive}>
        {isPositive ? "+" : ""}
        {formatAmount(gainLoss, currency)} ({percentageChange.toFixed(2)}%)
      </InvestmentCurrentValueStyled>
      <InvestmentInitialAmountStyled>
        <small>Init: {formatAmount(initialAmount, currency)}</small>
      </InvestmentInitialAmountStyled>
      <InvestmentCurrentValueStyled positive={isPositive}>
        <small>Curr: {formatAmount(currentAmount, currency)}</small>
      </InvestmentCurrentValueStyled>
      {/* <InvestmentCurrentValueStyled positive={isPositive}>
        {isPositive ? "+" : ""}
        {formatAmount(gainLoss, currency)}
      </InvestmentCurrentValueStyled>
      <InvestmentCurrentValueStyled positive={isPositive}>
        ({percentageChange.toFixed(2)}%)
      </InvestmentCurrentValueStyled> */}
    </InvestmentItemDetailsContainerStyled>
  );
};
