import { styled } from "@mui/material/styles";

export const GroupCardStyled = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "12px",
}));

export const GroupNameStyled = styled("div")({
  fontSize: "16px",
  fontWeight: 600,
});

export const MemberRowStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  fontSize: "14px",
}));

export const MemberMetaStyled = styled("span")(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "12px",
  textTransform: "capitalize",
}));

type RowActionProps = { danger?: boolean };

// Small inline text action for member/invite rows (so it aligns with the text
// instead of a full-height button).
export const RowActionStyled = styled("button", {
  shouldForwardProp: (prop) => prop !== "danger",
})<RowActionProps>(({ theme, danger }) => ({
  border: "none",
  background: "none",
  padding: 0,
  cursor: "pointer",
  fontSize: "13px",
  color: danger ? theme.palette.error.main : theme.palette.secondary.main,

  "&:hover": {
    textDecoration: "underline",
  },
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
