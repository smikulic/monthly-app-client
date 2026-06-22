import { styled } from "@mui/material/styles";

type BudgetAmountStyledProps = {
  positive: boolean;
};

type ExpenseAmountStyledProps = {
  prominent: boolean;
};

// Amounts sit in a right-aligned, vertically-centered column so they stay
// aligned with the row title regardless of row height (no absolute offsets).
export const AmountColumnStyled = styled("div")({
  marginLeft: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  justifyContent: "center",
  lineHeight: 1.25,
  fontVariantNumeric: "tabular-nums",
});

export const BudgetAmountStyled = styled("div")<BudgetAmountStyledProps>(
  ({ positive }) => ({
    fontSize: "14px",
    color: positive ? "#7fb77e" : "#ff7777",
  }),
);

export const ExpenseAmountStyled = styled("div")<ExpenseAmountStyledProps>(
  ({ prominent }) => ({
    fontSize: prominent ? "16px" : "14px",
    color: "#878BAC",
  }),
);
