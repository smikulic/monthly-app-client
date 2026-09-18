import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material";
import { tokens } from "@/theme/tokens";

/**
 * Only ever rendered on a phone, so it is sized for one — full width, generous
 * tap targets, no attempt to be a desktop card at a smaller scale.
 */
export const InstallCardStyled = styled("section")(({ theme }) => ({
  margin: "32px auto 0",
  maxWidth: 420,
  padding: "20px 22px",
  background: theme.palette.surface,
  border: `1px solid ${theme.palette.hairline}`,
  borderRadius: tokens.radius.lg,
  boxShadow: "0 1px 2px rgba(20, 18, 15, 0.04)",
  textAlign: "left",
}));

export const InstallTitleStyled = styled("h2")(({ theme }) => ({
  margin: "0 0 6px 0",
  fontFamily: tokens.font.serif,
  fontSize: tokens.fontSize.lg,
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const InstallLeadStyled = styled("p")(({ theme }) => ({
  margin: "0 0 18px 0",
  fontSize: tokens.fontSize.sm,
  lineHeight: 1.5,
  color: theme.palette.text.secondary,
}));

/** Numbered, because the whole point is that it is three taps and then done. */
export const InstallStepsStyled = styled("ol")(({ theme }) => ({
  margin: 0,
  padding: 0,
  listStyle: "none",
  counterReset: "install-step",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
}));

export const InstallStepStyled = styled("li")(({ theme }) => ({
  counterIncrement: "install-step",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.25),
  fontSize: tokens.fontSize.md,
  lineHeight: 1.4,
  color: theme.palette.text.primary,

  "&::before": {
    content: 'counter(install-step)',
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    borderRadius: "50%",
    background: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    fontSize: tokens.fontSize.xs,
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
  },
}));

/**
 * The actual glyph from the phone's own toolbar, inline in the sentence.
 *
 * "Tap the Share button" sends people hunting; showing the icon they are
 * looking for, at the size they will see it, does not.
 */
export const InstallGlyphStyled = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  verticalAlign: "-6px",
  width: 28,
  height: 28,
  margin: "0 2px",
  borderRadius: tokens.radius.sm,
  background: theme.palette.ground,
  border: `1px solid ${theme.palette.hairline}`,
  color: theme.palette.text.primary,

  "& svg": { fontSize: 18 },
}));

/**
 * Separates the one-tap button from the manual steps below it.
 *
 * Without a label the steps read as a second instruction rather than an
 * alternative to the first, which is the one way showing both could be worse
 * than showing either.
 */
export const InstallAlternativeStyled = styled("p")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  margin: "18px 0 14px 0",
  fontSize: tokens.fontSize.xs,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: theme.palette.text.secondary,

  // A rule either side, so it reads as a divider rather than a heading.
  "&::before, &::after": {
    content: '""',
    flex: 1,
    height: 1,
    background: theme.palette.hairline,
  },
}));

/** Shown only when the browser actually offered a one-tap install. */
export const InstallButtonStyled = styled("button")(({ theme }) => ({
  appearance: "none",
  width: "100%",
  marginTop: 4,
  padding: "12px 20px",
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: tokens.radius.sm,
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontFamily: "inherit",
  fontSize: tokens.fontSize.md,
  fontWeight: 600,
  cursor: "pointer",

  "&:hover": {
    background: tokens.accent.hover,
  },
}));
