import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { AUTH_TOKEN_USER } from "../../constants";
import {
  BackButtonStyled,
  HeaderStyled,
  LogoutButtonStyled,
} from "./header-style";

export const Header = ({ onLogout }: { onLogout: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const userName = localStorage.getItem(AUTH_TOKEN_USER)!.split("@")[0];
  const isHome = location.pathname === "/app";

  return (
    <HeaderStyled>
      {!isHome && (
        <BackButtonStyled onClick={() => navigate("/app")}>
          <ChevronLeftIcon />
          back
        </BackButtonStyled>
      )}
      {userName}
      <LogoutButtonStyled onClick={onLogout}>logout</LogoutButtonStyled>
    </HeaderStyled>
  );
};
