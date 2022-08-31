import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_TOKEN, AUTH_TOKEN_USER } from "../../constants";
import "./header.css";

export const Header = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <div className="header">
      <div className="flex flex-fixed black">
        {authToken && (
          <div className="flex">
            <div className="ml1">|</div>
            <Link to="/create" className="ml1 no-underline black">
              submit
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-fixed">
        {authToken ? (
          <div
            className="ml1 pointer black"
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
              localStorage.removeItem(AUTH_TOKEN_USER);
              navigate(`/`);
            }}
          >
            logout
          </div>
        ) : (
          <Link to="/login" className="ml1 no-underline black">
            login
          </Link>
        )}
      </div>
    </div>
  );
};
