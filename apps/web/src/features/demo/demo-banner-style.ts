import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material";
import { tokens } from "@/theme/tokens";

/**
 * Sticky rather than fixed: a fixed band would need every page to reserve room
 * for it, and the one place it must never be is scrolled away and forgotten —
 * somebody has to be able to find their way out of the demo from any screen.
 */
export const DemoBannerStyled = styled("div")(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: theme.zIndex.appBar,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
  flexWrap: "wrap",
  padding: "8px 16px",
  background: alpha(theme.palette.primary.main, 0.08),
  borderBottom: `1px solid ${theme.palette.hairline}`,
  fontSize: tokens.fontSize.sm,
  color: theme.palette.text.primary,
}));

export const DemoBannerTextStyled = styled("span")(({ theme }) => ({
  color: theme.palette.text.secondary,

  "& strong": {
    color: theme.palette.text.primary,
    fontWeight: 600,
  },
}));

export const DemoBannerActionsStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

/**
 * A real `<button>`, not a styled div: it is the escape hatch, so it has to be
 * reachable by keyboard and announced as a control.
 */
export const DemoBannerButtonStyled = styled("button")(({ theme }) => ({
  appearance: "none",
  padding: "4px 12px",
  height: tokens.controlHeight - 8,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: "8px",
  background: "transparent",
  color: theme.palette.primary.main,
  fontSize: tokens.fontSize.sm,
  fontFamily: "inherit",
  cursor: "pointer",

  "&:hover": {
    background: alpha(theme.palette.primary.main, 0.06),
  },

  "&:disabled": {
    cursor: "wait",
    opacity: 0.6,
  },
}));
