import { styled } from "@mui/material/styles";
import { Avatar } from "@/components/ui/Avatar";
import { tokens } from "@/theme/tokens";

export const HeaderStyled = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  // Full-bleed bar, centred contents: the border still spans the window while
  // the brand and avatar line up with the cards below.
  //
  // Aligned against the cards' own edge, not the column's. Cards sit 12px
  // inside the content column, so centring on the raw column width left the
  // header out by exactly that much.
  padding: `12px max(16px, calc((100% - ${tokens.contentMaxWidth - tokens.cardInset * 2}px) / 2))`,
  height: "64px",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const HeaderLeftStyled = styled("div")({
  display: "flex",
  alignItems: "center",
});

// Buttons, not divs: these navigate, so they must be reachable and
// activatable from the keyboard like any other control.
export const BrandStyled = styled("button")(({ theme }) => ({
  border: "none",
  background: "transparent",
  padding: 0,
  font: "inherit",
  fontSize: tokens.fontSize.xl,
  fontWeight: 700,
  letterSpacing: "-0.02em",
  color: theme.palette.primary.main,
  cursor: "pointer",
}));

export const BackButtonStyled = styled("button")(({ theme }) => ({
  border: "none",
  background: "transparent",
  padding: 0,
  font: "inherit",
  display: "flex",
  alignItems: "center",
  height: "40px",
  fontSize: tokens.fontSize.md,
  color: theme.palette.text.primary,
  cursor: "pointer",

  "&:hover": {
    color: theme.palette.secondary.main,
  },
}));

/**
 * A `button`, not a `div` — see ScopeTriggerStyled. Without it the account
 * menu could not be opened from the keyboard, and MUI had no focusable anchor
 * to restore focus to when the menu closed.
 */
export const AccountTriggerStyled = styled("button")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: "4px 8px",
  border: "none",
  borderRadius: "10px",
  background: "transparent",
  font: "inherit",
  color: "inherit",
  cursor: "pointer",

  "&:hover": {
    background: theme.palette.action.hover,
  },

  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },
}));

export const AccountAvatarStyled = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  fontSize: "14px",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

/** Avatar beside the identity, so the menu connects to the trigger clicked. */
export const MenuHeaderStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 2),
}));

export const MenuHeaderTextStyled = styled("div")({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
});

export const MenuHeaderNameStyled = styled("span")(({ theme }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: tokens.fontSize.sm,
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const MenuHeaderEmailStyled = styled("span")(({ theme }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: tokens.fontSize.xs,
  color: theme.palette.text.secondary,
}));

export const MenuDividerStyled = styled("div")(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  margin: theme.spacing(0.5, 0),
}));
