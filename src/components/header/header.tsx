import React, { Dispatch, SetStateAction } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { AUTH_TOKEN, AUTH_TOKEN_USER } from "../../constants";
import "./header.css";

export const Header = ({
  setAuthenticated,
}: {
  setAuthenticated: Dispatch<SetStateAction<string | null>>;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem(AUTH_TOKEN_USER)!.split("@")[0];
  const isHome = location.pathname === "/";

  return (
    <div className="header">
      <div>
        {!isHome && (
          <span className="iconBack" onClick={() => navigate("/")}>
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
          setAuthenticated(null);
          navigate("/");
        }}
      >
        logout
      </div>
    </div>
  );
};
