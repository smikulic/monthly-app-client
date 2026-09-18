import { alpha, styled } from "@mui/material/styles";
import { tokens } from "@/theme/tokens";

/**
 * One card per group, matching the cards elsewhere in the app.
 *
 * These used to sit inside a second bordered card wrapping the whole page,
 * so every group was a border inside a near-identical border.
 */
export const GroupCardStyled = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  background: theme.palette.surface,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: `${tokens.radius.md}px`,
  boxShadow: "0 1px 2px rgba(20, 18, 15, 0.04)",
  overflow: "hidden",
}));

/** Group name, member count and the group's overflow menu. */
export const GroupHeaderStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const GroupNameStyled = styled("div")({
  fontSize: "16px",
  fontWeight: 600,
});

/** "2 members · 3 shared categories" — what the group actually is and does. */
export const GroupMetaStyled = styled("div")(({ theme }) => ({
  marginTop: "2px",
  fontSize: "13px",
  color: theme.palette.text.secondary,
}));

export const MemberRowStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.25, 2),

  "& + &": {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
}));

/** Name over address, so the row leads with a person rather than a string. */
export const MemberIdentityStyled = styled("div")({
  minWidth: 0,
  flex: 1,
});

export const MemberNameStyled = styled("div")(({ theme }) => ({
  fontSize: "15px",
  color: theme.palette.text.primary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

export const MemberEmailStyled = styled("div")(({ theme }) => ({
  fontSize: "13px",
  color: theme.palette.text.secondary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

type RoleChipProps = { muted?: boolean };

/**
 * Role as a chip rather than loose grey text, so it reads as a property of the
 * person instead of a stray word after their address. `muted` marks a pending
 * invite, which is a state rather than a role.
 */
export const RoleChipStyled = styled("span", {
  shouldForwardProp: (prop) => prop !== "muted",
})<RoleChipProps>(({ theme, muted }) => ({
  flexShrink: 0,
  padding: "2px 8px",
  borderRadius: "6px",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.03em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  color: muted ? theme.palette.text.secondary : theme.palette.primary.main,
  background: muted
    ? theme.palette.action.hover
    : alpha(theme.palette.primary.main, 0.12),
}));

/** Footer action inside the card, matching the list "add" rows. */
export const GroupFooterActionStyled = styled("button")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  width: "100%",
  padding: theme.spacing(1.5, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
  border: "none",
  borderTopWidth: "1px",
  borderTopStyle: "solid",
  borderTopColor: theme.palette.divider,
  background: alpha(theme.palette.primary.main, 0.06),
  color: theme.palette.primary.main,
  fontFamily: "inherit",
  fontSize: "15px",
  fontWeight: 500,
  cursor: "pointer",

  "& svg": { fontSize: "20px" },

  "&:hover": {
    background: alpha(theme.palette.primary.main, 0.12),
  },
}));

/** Heading row: title and description on the left, the create action right. */
export const PageHeaderStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  flexWrap: "wrap",
}));

// Text input + action button: stacked full-width on mobile, an inline width-
// capped row on larger screens (so the input doesn't stretch the whole card).
export const InlineFormStyled = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  // The shared TextField uses margin="normal"; drop it so it aligns with the button.
  "& > *:first-of-type": { margin: 0 },
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 520,
    "& > *:first-of-type": { flex: 1, margin: 0 },
  },
}));

/** Inline form inside a group card, so it lines up with the member rows. */
export const CardInlineFormStyled = styled(InlineFormStyled)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));
