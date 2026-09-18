import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material";
import { tokens } from "@/theme/tokens";

export const WizardIntroStyled = styled("p")(({ theme }) => ({
  margin: 0,
  fontSize: tokens.fontSize.sm,
  color: theme.palette.text.secondary,
}));

export const WizardGroupStyled = styled("div")(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: tokens.radius.md,
  overflow: "hidden",
  background: theme.palette.surface,
}));

/**
 * A `<label>` wrapping its own checkbox, so the whole strip is the hit target.
 * On a phone a 16px checkbox alone is a miss waiting to happen.
 */
export const WizardGroupHeaderStyled = styled("label", {
  shouldForwardProp: (prop) => prop !== "selected",
})<{ selected?: boolean }>(({ theme, selected }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: "10px 12px",
  cursor: "pointer",
  background: selected
    ? alpha(theme.palette.primary.main, 0.05)
    : "transparent",
  borderBottom: selected ? `1px solid ${theme.palette.divider}` : "none",
  fontSize: tokens.fontSize.md,
}));

export const WizardGroupTotalStyled = styled("span")(({ theme }) => ({
  marginLeft: "auto",
  fontSize: tokens.fontSize.sm,
  color: theme.palette.text.secondary,
  fontVariantNumeric: "tabular-nums",
}));

export const WizardLineStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: "6px 12px",
  fontSize: tokens.fontSize.sm,

  "& > span": {
    flex: 1,
    color: theme.palette.text.primary,
  },
}));

/**
 * Bare rather than an MUI TextField: a dozen of these in one dialog, each with
 * its own floating label and outline, is a wall of chrome around six digits.
 */
export const WizardAmountInputStyled = styled("input")(({ theme }) => ({
  width: "96px",
  height: tokens.controlHeight - 4,
  padding: "0 10px",
  textAlign: "right",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: tokens.radius.sm,
  background: theme.palette.surface,
  color: theme.palette.text.primary,
  fontFamily: "inherit",
  fontSize: tokens.fontSize.sm,
  fontVariantNumeric: "tabular-nums",

  "&:focus": {
    outline: "none",
    borderColor: theme.palette.primary.main,
  },
}));

export const WizardFooterStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: theme.spacing(1),
  paddingTop: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
  fontSize: tokens.fontSize.sm,
  color: theme.palette.text.secondary,
}));

export const WizardTotalStyled = styled("strong")(({ theme }) => ({
  fontSize: tokens.fontSize.lg,
  color: theme.palette.text.primary,
  fontVariantNumeric: "tabular-nums",
}));

/** The way out. Quiet, but never absent — every step of this is optional. */
export const WizardSkipStyled = styled("button")(({ theme }) => ({
  appearance: "none",
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: tokens.fontSize.sm,
  color: theme.palette.text.secondary,
  textDecoration: "underline",

  "&:hover": {
    color: theme.palette.text.primary,
  },
}));
