import { styled } from "@mui/material/styles";
import { tokens } from "@/theme/tokens";

// Compact dropdown trigger sized to sit on the same baseline as the toolbar's
// month navigation and rollover switch (rather than a tall form-style Select).
export const ScopeTriggerStyled = styled("div")(({ theme }) => ({
  display: "flex",
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
  fontSize: 15,
  lineHeight: 1,
  whiteSpace: "nowrap",
  color: theme.palette.text.secondary,
}));

export const ScopeTriggerValueStyled = styled("span")(({ theme }) => ({
  minWidth: 0,
  maxWidth: 160,
  fontSize: 15,
  lineHeight: 1,
  color: theme.palette.text.primary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",

  [theme.breakpoints.down("sm")]: {
    fontSize: 14,
  },
}));
