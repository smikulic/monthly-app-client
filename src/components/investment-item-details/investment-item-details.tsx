import React from "react";
import {
  InvestmentInitialAmountStyled,
  InvestmentCurrentValueStyled,
  InvestmentItemDetailsContainerStyled,
  InvestmentDateStyled,
} from "./investment-item-details-style";
import { formatAmount } from "@/utils/format";
import dayjs from "dayjs";

interface Props {
  initialAmount: number;
  currentAmount: number;
  startDate: string;
  currency: string;
}

export const InvestmentItemDetails: React.FC<Props> = ({
  initialAmount,
  currentAmount,
  startDate,
  currency,
}) => {
  return (
    <InvestmentItemDetailsContainerStyled>
      <InvestmentInitialAmountStyled>
        Initial: {formatAmount(initialAmount, currency)}
      </InvestmentInitialAmountStyled>
      <InvestmentCurrentValueStyled positive={currentAmount >= initialAmount}>
        Current: {formatAmount(currentAmount, currency)}
      </InvestmentCurrentValueStyled>
      <InvestmentDateStyled>
        Since {dayjs(Number(startDate)).format("MMM YYYY")}
      </InvestmentDateStyled>
    </InvestmentItemDetailsContainerStyled>
  );
};