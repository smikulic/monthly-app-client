import { styled } from "@mui/material/styles";

// Compact dropdown trigger sized to sit on the same baseline as the toolbar's
// month navigation and rollover switch (rather than a tall form-style Select).
export const ScopeTriggerStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  height: 36,
  maxWidth: "100%",
  padding: "0 10px",
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  cursor: "pointer",
  overflow: "hidden",

  "&:hover": {
    background: theme.palette.action.hover,
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
