import { styled } from "@mui/material/styles";

export const ListItemStyled = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
});

type MainListItemStyledProps = {
  active?: boolean;
};

export const MainListItemStyled = styled(
  ListItemStyled
)<MainListItemStyledProps>(({ theme, active }) => ({
  margin: "10px 12px",
  padding: "16px 20px",
  border: active
    ? `1px solid ${theme.palette.text.secondary}`
    : `1px solid ${theme.palette.text.disabled}`,
  borderRadius: "16px",

  "&:hover": {
    borderColor: theme.palette.text.secondary,
  },
}));

type SubcategoryListItemStyledProps = {
  actionable?: boolean;
};

export const SubcategoryListItemStyled = styled(
  ListItemStyled
)<SubcategoryListItemStyledProps>(({ theme, actionable }) => ({
  height: "52px",
  margin: "6px 12px",
  padding: "8px 24px 8px 38px",
  border: `1px solid ${theme.palette.text.disabled}`,
  borderRadius: "16px",

  "&:hover": {
    borderColor: actionable
      ? theme.palette.text.secondary
      : theme.palette.text.disabled,
  },
}));

export const ProminentButtonStyled = styled("div")(({ theme }) => ({
  padding: "8px 16px",
  display: "flex",
  alignItems: "center",
  height: "40px",
  fontSize: "16px",
  color: theme.palette.primary.contrastText,
  border: `1px solid ${theme.palette.primary.contrastText}`,
  background: theme.palette.primary.main,
  borderRadius: "10px",
  cursor: "pointer",

  "&:hover": {
    opacity: 0.7,
  },
}));

export const FooterPaddingStyled = styled("div")({
  marginBottom: "56px",
});
