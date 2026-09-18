import { styled } from "@mui/material/styles";
import { tokens } from "@/theme/tokens";

/**
 * Compact dropdown trigger, sized to sit on the toolbar baseline rather than
 * being a tall form-style Select.
 *
 * A `button`, not a `div`. As a div it could not be tabbed to or opened from
 * the keyboard at all, and — because MUI returns focus to the anchor when a
 * Menu closes — focus had nowhere to go, so it stayed on the MenuItem while
 * the closing popover was marked aria-hidden.
 */
export const ScopeTriggerStyled = styled("button")(({ theme }) => ({
  display: "flex",
  font: "inherit",
  color: "inherit",
  alignItems: "center",
  gap: theme.spacing(0.75),
  height: tokens.controlHeight,
  maxWidth: "100%",
  padding: "0 10px",
  borderRadius: tokens.radius.sm,
  // Surface, matching the month segment and rollover chip. It was transparent,
  // so it read as a different kind of thing from the controls beside it.
  background: theme.palette.surface,
  border: `1px solid ${theme.palette.divider}`,
  cursor: "pointer",
  overflow: "hidden",

  "&:hover": {
    borderColor: theme.palette.primary.main,
  },

  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },

  [theme.breakpoints.down("sm")]: {
    height: tokens.controlHeightMobile,
  },

  "& svg": {
    flexShrink: 0,
    fontSize: 20,
    color: theme.palette.text.secondary,
  },
}));

export const ScopeTriggerLabelStyled = styled("span")(({ theme }) => ({
  flexShrink: 0,
  fontSize: tokens.fontSize.md,
  lineHeight: 1,
  whiteSpace: "nowrap",
  color: theme.palette.text.secondary,
}));

export const ScopeTriggerValueStyled = styled("span")(({ theme }) => ({
  minWidth: 0,
  maxWidth: 160,
  fontSize: tokens.fontSize.md,
  lineHeight: 1,
  color: theme.palette.text.primary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",

  [theme.breakpoints.down("sm")]: {
    fontSize: tokens.fontSize.sm,
  },
}));
