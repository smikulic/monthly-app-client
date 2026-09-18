import { alpha, styled } from "@mui/material/styles";
import { tokens } from "@/theme/tokens";

type DangerProps = { danger?: boolean };

/**
 * One card per section of a settings-style page.
 *
 * These pages used to be a single unfilled card with `<hr>` rules between
 * sections, which on a warm ground read as one flat beige sheet — the same
 * problem the budget list had. A filled card per section gives each one an
 * edge and matches the cards everywhere else in the app.
 */
export const SectionCardStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "danger",
})<DangerProps>(({ theme, danger }) => ({
  display: "flex",
  flexDirection: "column",
  background: theme.palette.surface,
  border: `1px solid ${
    danger ? alpha(theme.palette.money.error, 0.35) : theme.palette.divider
  }`,
  borderRadius: `${tokens.radius.md}px`,
  boxShadow: "0 1px 2px rgba(20, 18, 15, 0.04)",
  overflow: "hidden",
}));

export const SectionCardHeaderStyled = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const SectionCardTitleStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "danger",
})<DangerProps>(({ theme, danger }) => ({
  fontSize: tokens.fontSize.lg,
  fontWeight: 600,
  color: danger ? theme.palette.money.error : theme.palette.text.primary,
}));

export const SectionCardDescriptionStyled = styled("div")(({ theme }) => ({
  marginTop: "4px",
  fontSize: tokens.fontSize.sm,
  color: theme.palette.text.secondary,
}));

export const SectionCardBodyStyled = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));
