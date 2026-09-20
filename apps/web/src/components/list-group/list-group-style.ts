import { styled } from "@mui/material/styles";
import { tokens } from "@/theme/tokens";
import { ListItemStyled } from "@/shared";

type ActiveProps = { active?: boolean };
type RowProps = { actionable?: boolean };

// One connected card per category. When expanded, its children (subcategories,
// expenses) live inside this same card as indented rows separated by hairline
// dividers, instead of separate floating pills.
//
// Filled, matching the dashboard cards. It was previously unfilled so the
// budget wash could show through from z-index -1; the wash now stacks inside
// the row instead, which leaves the card free to lift off the paper rather
// than leaving the whole list flat beige on a beige ground.
export const GroupCardStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "active",
})<ActiveProps>(({ theme, active }) => ({
  margin: "8px 12px",
  background: theme.palette.surface,
  border: `1px solid ${
    active ? theme.palette.primary.main : theme.palette.divider
  }`,
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: active ? "none" : "0 1px 2px rgba(20, 18, 15, 0.04)",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",

  "&:hover": {
    borderColor: theme.palette.primary.main,
    boxShadow: "0 2px 8px rgba(20, 18, 15, 0.06)",
  },
}));

// Top-level header row (level 0). The clickable area + chevrons come from the
// nested ListItemHeader, so the row itself stays unstyled for interaction.
export const GroupHeaderRowStyled = styled(ListItemStyled)({
  padding: "14px 16px",
});

// Child row (level 1): borderless, indented, divided from the row above.
export const GroupRowStyled = styled(ListItemStyled, {
  shouldForwardProp: (prop) => prop !== "actionable",
})<RowProps>(({ theme, actionable }) => ({
  padding: "12px 16px 12px 34px",
  borderTop: `1px solid ${theme.palette.divider}`,
  cursor: actionable ? "pointer" : "default",
}));

// Bottom "add" action inside the group. Matches the filled variant of
// ProminentButtonStyled — the same treatment as Create in the dialogs — so a
// primary action looks the same wherever it appears.
export const GroupAddRowStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "14px 16px",
  borderTop: `1px solid ${theme.palette.divider}`,
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: tokens.fontSize.md,
  cursor: "pointer",

  "& svg": {
    fontSize: "20px",
    color: theme.palette.primary.contrastText,
  },

  // Same touch-sticky hover as `ProminentButtonStyled`: this row is a pine
  // fill, and 70% of it reads as a disabled control rather than a hovered one.
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": {
      opacity: 0.7,
    },
  },
}));
