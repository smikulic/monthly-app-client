import React, { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_TOKEN, AUTH_TOKEN_USER } from "../../constants";
import "./header.css";

export const Header = ({
  setAuthenticated,
}: {
  setAuthenticated: Dispatch<SetStateAction<string | null>>;
}) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem(AUTH_TOKEN_USER)!.split("@")[0];

  return (
    <div className="header">
      <div>{userName}</div>
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
