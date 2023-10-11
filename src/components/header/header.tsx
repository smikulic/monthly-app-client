import React, { Dispatch, SetStateAction } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { AUTH_TOKEN, AUTH_TOKEN_USER } from "../../constants";
import "./header.css";

export const Header = ({
  setToken,
}: {
  setToken: Dispatch<SetStateAction<string | null>>;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem(AUTH_TOKEN_USER)!.split("@")[0];
  const isHome = location.pathname === "/app";

  return (
    <div className="header">
      <div>
        {!isHome && (
          <span className="iconBack" onClick={() => navigate("/app")}>
            <ChevronLeftIcon />
            Back
          </span>
        )}
        {userName}
      </div>
      <div
        className="logout"
        onClick={() => {
          localStorage.removeItem(AUTH_TOKEN);
          localStorage.removeItem(AUTH_TOKEN_USER);
          setToken(null);
          navigate("/app");
        }}
      >
        logout
      </div>
    </div>
  );
};
