import { styled } from "@mui/material/styles";
import { tokens } from "@/theme/tokens";

export const InsightsWrapperStyled = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: "8px 12px 24px",
}));

export const SectionStyled = styled("div")(({ theme }) => ({
  // Surface with a hairline, matching every other card in the app. These were
  // unfilled with a `text.disabled` border — beige on beige, outlined in a
  // colour meant for disabled text rather than for edges.
  background: theme.palette.surface,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: tokens.radius.md,
  boxShadow: "0 1px 2px rgba(20, 18, 15, 0.04)",
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
  fontSize: tokens.fontSize.hero,
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
  color: negative ? theme.palette.money.negative : theme.palette.text.primary,
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
  padding: "8px 0",
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
  // Takes the middle of the row on desktop; full width beneath it on phones.
  flex: 1,
  minWidth: 80,
  width: "100%",
  height: 6,
  borderRadius: 3,
  background: theme.palette.divider,
  overflow: "hidden",
  marginTop: 5,
}));

/**
 * One category's pace: name, meter, figures.
 *
 * Above 600px the meter moves into the row itself, filling the gap that sat
 * empty between the name and the amounts and saving a line per entry. Below
 * that it drops underneath, where the name matters more than the meter and
 * should not have to truncate for it.
 */
export const PaceRowStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: "6px 0",

  [theme.breakpoints.down("sm")]: {
    // Not `display: block`, which stacked name, meter and figures as three
    // separate lines — taller than what it replaced. Wrap instead, and reorder
    // so the first line is name and figures, the second the meter across.
    flexWrap: "wrap",
    gap: theme.spacing(0.5),
    "& > *:nth-of-type(1)": { order: 1, flex: 1 },
    "& > *:nth-of-type(3)": { order: 2 },
    "& > *:nth-of-type(2)": { order: 3, flexBasis: "100%" },
  },
}));

/**
 * Header row of the "This month" card: the hero figure on the left, the
 * month-over-month comparison on the right.
 *
 * These were two separate cards answering one question, each mostly empty on
 * the right — and the second card's headline restated a figure the first
 * already showed. Putting the comparison in that empty space removes a header,
 * a frame and the duplicated number.
 */
export const SummaryHeadStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: theme.spacing(2),

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: theme.spacing(1),
  },
}));

/** Right-hand column of that row: the delta above what it is measured against. */
export const SummaryCompareStyled = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  whiteSpace: "nowrap",

  [theme.breakpoints.down("sm")]: {
    alignItems: "flex-start",
  },
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
