import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material";
import { tokens } from "@/theme/tokens";

/**
 * Sits under the dashboard rows, not above them. Somebody opening the app is
 * here to see their month, not to be sold the next feature — this comes after
 * they have got what they came for.
 */
export const HouseholdPromptStyled = styled("section")(({ theme }) => ({
  margin: "18px 12px 0",
  padding: "18px 20px",
  borderRadius: tokens.radius.md,
  border: `1px solid ${theme.palette.hairline}`,
  // A tint rather than surface white, so it reads as an aside and not as one
  // more row of figures.
  background: alpha(theme.palette.primary.main, 0.04),
}));

export const HouseholdPromptTitleStyled = styled("h2")(({ theme }) => ({
  margin: "0 0 6px 0",
  fontFamily: tokens.font.serif,
  fontSize: tokens.fontSize.lg,
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const HouseholdPromptTextStyled = styled("p")(({ theme }) => ({
  margin: "0 0 16px 0",
  fontSize: tokens.fontSize.sm,
  lineHeight: 1.5,
  color: theme.palette.text.secondary,
}));

export const HouseholdPromptButtonStyled = styled("button")(({ theme }) => ({
  appearance: "none",
  padding: "9px 18px",
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: tokens.radius.sm,
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontFamily: "inherit",
  fontSize: tokens.fontSize.sm,
  fontWeight: 600,
  cursor: "pointer",

  // Guarded: on touch, hover sticks after a tap, and a faded primary button
  // reads as disabled.
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { background: tokens.accent.hover },
  },
}));
