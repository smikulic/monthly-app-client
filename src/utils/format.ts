import accounting from "accounting";

export const formatAmount = (amount: number): string => {
  return accounting.formatMoney(amount, {
    symbol: "€",
    format: "%v %s",
    precision: 0,
  });
};
