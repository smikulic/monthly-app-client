import { alpha, styled } from "@mui/material/styles";
import { tokens } from "@/theme/tokens";

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

// Toolbar: the control row for scope, month and rollover.
//
// Two layouts from one component, switched in CSS rather than with
// `useResponsive`, so there is no JS branch and no flash of the wrong layout.
//
// Desktop groups its controls to the left. The three zones used to be `flex: 1`
// each, which flung them to the extreme edges of the content column and left
// the month label marooned in the middle — toolbars in serious tools group,
// they do not spread.
//
// On phones it becomes a fixed bottom bar. Month navigation is the most-used
// control on these pages and the top of the screen is the hardest place for a
// thumb to reach.
//
// No bottom border on desktop: the toolbar lives inside the capped content
// column while the topbar is full-bleed, so its rule stopped short of the
// window and read as a broken line under the topbar's full-width one.
export const ToolbarStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  // Desktop groups from the left and lets the right zone push itself away.
  // Phones switch to three balanced zones, which centres the month nav.
  justifyContent: "flex-start",
  padding: "8px 16px",
  minHeight: "48px",

  [theme.breakpoints.down("sm")]: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    // Ground, not surface. The topbar and page are both on ground, so a
    // white bar was brighter than everything around it — and the controls
    // inside it are surface white, so they vanished into their own bar.
    background: theme.palette.ground,
    borderTop: `1px solid ${theme.palette.divider}`,
    // Clears the Android gesture bar and the iOS home indicator. Without it
    // the controls sit under the system navigation in the TWA.
    paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0px))",
    boxShadow: "0 -1px 8px rgba(20, 18, 15, 0.06)",
  },
}));

export const ToolbarLeftStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  minWidth: 0,
  flex: "0 0 auto",

  // Phones spread the three zones instead, which puts the month nav in the
  // middle of the bar — the easiest spot for either thumb.
  [theme.breakpoints.down("sm")]: {
    flex: 1,
  },
}));

export const ToolbarCenterStyled = styled("div")({
  flex: "0 0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const ToolbarRightStyled = styled("div")(({ theme }) => ({
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: theme.spacing(1),
  // Pushes itself to the far edge so the left zone can stay grouped.
  marginLeft: "auto",

  [theme.breakpoints.down("sm")]: {
    flex: 1,
  },

  // MUI gives a switch's FormControlLabel a negative left margin; reset it so
  // the rollover toggle doesn't creep onto the month navigation.
  "& .MuiFormControlLabel-root": {
    marginLeft: 0,
    marginRight: 0,
  },
}));

/**
 * Month navigation as one bordered segment rather than two floating chevrons
 * with a label between them.
 *
 * The chevrons were bare `svg`s with a cursor and no hit area, hover surface
 * or rounding — they read as decoration rather than controls, and were an
 * awkward tap target on a phone.
 */
export const MonthPaginationStyled = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  height: tokens.controlHeight,
  padding: "0 2px",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: `${tokens.radius.sm}px`,
  background: theme.palette.surface,
  whiteSpace: "nowrap",

  [theme.breakpoints.down("sm")]: {
    height: tokens.controlHeightMobile,
  },
}));

/** The month label between the two arrows. */
export const MonthLabelStyled = styled("span")(({ theme }) => ({
  minWidth: "92px",
  textAlign: "center",
  padding: "0 4px",
  fontSize: "15px",
  fontWeight: 500,
  color: theme.palette.text.primary,
  // So the label does not change width as the month name does, which would
  // shuffle the arrows under the user's thumb.
  fontVariantNumeric: "tabular-nums",

  [theme.breakpoints.down("sm")]: {
    minWidth: "84px",
  },
}));

/** Previous/next arrow. A real button surface, not a bare icon. */
export const MonthNavButtonStyled = styled("button")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "calc(100% - 4px)",
  padding: 0,
  border: "none",
  borderRadius: "6px",
  background: "transparent",
  color: theme.palette.text.secondary,
  cursor: "pointer",

  "& svg": { fontSize: "20px" },

  "&:hover": {
    background: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },

  // Comfortable one-handed target on a phone, where this is the control people
  // hit most.
  [theme.breakpoints.down("sm")]: {
    width: "40px",
  },
}));

/**
 * Rollover toggle, as a chip the same shape and height as the other controls.
 *
 * It was a MUI `Switch` with a bare label — a phone-settings idiom, and the
 * only control in the bar with no container, so it never sat on the same
 * baseline as the rest. A pressed chip also states the active mode rather than
 * leaving the off state unnamed.
 */
export const RolloverToggleStyled = styled("button", {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  height: tokens.controlHeight,
  padding: "0 12px",
  borderRadius: tokens.radius.sm,
  background: active
    ? alpha(theme.palette.primary.main, 0.12)
    : theme.palette.surface,
  border: `1px solid ${
    active ? theme.palette.primary.main : theme.palette.divider
  }`,
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  fontSize: 15,
  fontWeight: active ? 600 : 400,
  fontFamily: "inherit",
  whiteSpace: "nowrap",
  cursor: "pointer",

  "& svg": { fontSize: 18 },

  "&:hover": {
    borderColor: theme.palette.primary.main,
  },

  [theme.breakpoints.down("sm")]: {
    height: tokens.controlHeightMobile,
    padding: "0 10px",
  },
}));
