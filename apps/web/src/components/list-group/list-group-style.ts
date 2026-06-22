import { styled } from "@mui/material/styles";
import { ListItemStyled } from "@/shared";

type ActiveProps = { active?: boolean };
type RowProps = { actionable?: boolean };

// One connected card per category. When expanded, its children (subcategories,
// expenses) live inside this same card as indented rows separated by hairline
// dividers, instead of separate floating pills. No background fill: a row's
// budget ProgressBar wash sits at z-index -1 and must show through to the
// (white) page behind the card.
export const GroupCardStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "active",
})<ActiveProps>(({ theme, active }) => ({
  margin: "8px 12px",
  border: `1px solid ${
    active ? theme.palette.text.secondary : theme.palette.text.disabled
  }`,
  borderRadius: "12px",
  overflow: "hidden",
  transition: "border-color 0.15s ease",

  "&:hover": {
    borderColor: theme.palette.text.secondary,
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

// Bottom "add" action, rendered as a solid teal footer row inside the group.
export const GroupAddRowStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "14px 16px",
  borderTop: `1px solid ${theme.palette.divider}`,
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: "15px",
  cursor: "pointer",

  "& svg": {
    fontSize: "20px",
    color: theme.palette.primary.contrastText,
  },

  "&:hover": {
    opacity: 0.9,
  },
}));
