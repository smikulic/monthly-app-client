import { styled } from "@mui/material/styles";

// Legacy bar: free-form children spread across a space-between row.
// Used by pages that lay out their own content (investments, saving goals).
export const ActionsBarStyled = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "0 12px",
  height: "56px",
  fontSize: "18px",
});

// Toolbar: a bordered control row that sits directly under the topbar.
// Three balanced zones — View filter (left), month nav (center), action (right).
export const ToolbarStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: "6px 16px",
  minHeight: "48px",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const ToolbarLeftStyled = styled("div")({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  minWidth: 0,
});

export const ToolbarCenterStyled = styled("div")({
  flex: "0 0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const ToolbarRightStyled = styled("div")(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: theme.spacing(1),

  // MUI gives a switch's FormControlLabel a negative left margin; reset it so
  // the rollover toggle doesn't creep onto the month navigation.
  "& .MuiFormControlLabel-root": {
    marginLeft: 0,
    marginRight: 0,
  },
}));

export const MonthPaginationStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontSize: "17px",
  whiteSpace: "nowrap",
  color: theme.palette.primary.contrastText,

  "& svg": {
    fontSize: "26px",
    color: theme.palette.primary.contrastText,
    borderRadius: "5px",
    cursor: "pointer",
  },
  "& svg:hover": {
    color: theme.palette.secondary.main,
  },

  [theme.breakpoints.down("sm")]: {
    fontSize: "15px",
    gap: theme.spacing(0.5),
    "& svg": {
      fontSize: "24px",
    },
  },
}));
