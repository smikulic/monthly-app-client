import { styled } from "@mui/material/styles";
import { tokens } from "@/theme/tokens";

export const InsightsWrapperStyled = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: "8px 12px 24px",
}));

export const SectionStyled = styled("div")(({ theme }) => ({
  border: `1px solid ${theme.palette.text.disabled}`,
  borderRadius: 12,
  padding: "16px",
}));

export const SectionTitleStyled = styled("h3")(({ theme }) => ({
  margin: 0,
  marginBottom: theme.spacing(1.5),
  fontSize: tokens.fontSize.sm,
  fontWeight: 600,
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
}));

export const HeroAmountStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "negative",
})<{ negative?: boolean }>(({ theme, negative }) => ({
  fontSize: 32,
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
  color: negative ? theme.palette.error.main : theme.palette.text.primary,
}));

export const SubtleTextStyled = styled("div")(({ theme }) => ({
  fontSize: tokens.fontSize.sm,
  color: theme.palette.text.secondary,
}));

export const RowStyled = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  padding: "10px 0",
  fontVariantNumeric: "tabular-nums",

  "& + &": {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
}));

export const RowMainStyled = styled("div")({
  minWidth: 0,
  flex: 1,
});

export const RowTitleStyled = styled("div")({
  fontSize: tokens.fontSize.md,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const RowRightStyled = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  whiteSpace: "nowrap",
});

export const BarTrackStyled = styled("div")(({ theme }) => ({
  width: "100%",
  height: 6,
  borderRadius: 3,
  background: theme.palette.action.hover,
  overflow: "hidden",
  marginTop: 6,
}));

export const DeltaStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "up",
})<{ up?: boolean }>(({ theme, up }) => ({
  display: "flex",
  alignItems: "center",
  gap: 2,
  fontSize: tokens.fontSize.md,
  fontWeight: 600,
  // Spending trending up is bad news in a budget; trending down is good.
  color: up ? theme.palette.money.negative : theme.palette.money.positive,

  "& svg": {
    fontSize: 18,
  },
}));

export const StreakBadgeStyled = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: tokens.fontSize.sm,
  fontWeight: 600,
  // A streak is chrome, not an amount, so it takes the accent.
  color: theme.palette.primary.main,
}));

export const EmptyTextStyled = styled("div")(({ theme }) => ({
  fontSize: tokens.fontSize.sm,
  color: theme.palette.text.secondary,
}));
