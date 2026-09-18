import { styled } from "@mui/material/styles";
import { tokens } from "@/theme/tokens";

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
  // Above the progress wash, which is absolutely positioned across the row.
  position: "relative",
  zIndex: 1,
});

// The budget line: either the month's budget or what is left of it, depending
// on the rollover toggle. Context for the figure above it, so it sits smaller
// and quieter — and coloured only once the budget runs out. Every row is
// normally under budget, so colouring the healthy case painted the whole list
// green and left nothing to mark the row that actually needs attention.
export const BudgetAmountStyled = styled("div")<BudgetAmountStyledProps>(
  ({ theme, positive }) => ({
    fontSize: tokens.fontSize.sm,
    color: positive
      ? theme.palette.text.secondary
      : theme.palette.money.negative,
  }),
);

// Amount spent — the figure of the row, so it takes ink and a little weight.
// It was previously the same size and colour as the line beneath it, which
// left no way to tell which number was the subject.
export const ExpenseAmountStyled = styled("div")<ExpenseAmountStyledProps>(
  ({ theme, prominent }) => ({
    fontSize: prominent ? tokens.fontSize.lg : tokens.fontSize.md,
    fontWeight: 500,
    color: theme.palette.text.primary,
  }),
);
