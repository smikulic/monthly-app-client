import { styled } from "@mui/material/styles";
import { ProminentButtonStyled } from "../../shared";

export const HeaderStyled = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: "32px",
  height: "64px",
  border: "1px solid rgb(223, 223, 223)",
});

export const BackButtonStyled = styled(ProminentButtonStyled)({
  position: "absolute",
  top: "13px",
  left: "32px",
});

export const LogoutButtonStyled = styled(ProminentButtonStyled)({
  marginLeft: "16px",
});
