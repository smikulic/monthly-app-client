import { styled } from "@mui/material/styles";

export const HeaderStyled = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: "24px 12px",
  height: "64px",
  border: `1px solid ${theme.palette.text.disabled}`,
}));

export const BackButtonStyled = styled("div")(({ theme }) => ({
  padding: "8px 0",
  display: "flex",
  alignItems: "center",
  height: "40px",
  fontSize: "16px",
  color: theme.palette.primary.contrastText,
  borderRadius: "10px",
  cursor: "pointer",

  "&:hover": {
    color: theme.palette.secondary.main,
  },

  position: "absolute",
  top: "13px",
  left: "12px",
}));
