import { styled } from "@mui/material/styles";

export const HeaderStyled = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: "24px",
  height: "64px",
  border: "1px solid rgb(223, 223, 223)",
});

export const BackButtonStyled = styled("div")({
  padding: "8px 16px",
  display: "flex",
  alignItems: "center",
  height: "40px",
  fontSize: "16px",
  color: "#181818",
  borderRadius: "5px",
  cursor: "pointer",

  "&:hover": {
    color: " #f199c0",
  },

  position: "absolute",
  top: "13px",
  left: "24px",
});
