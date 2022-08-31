import * as React from "react";
import { Link } from "react-router-dom";
import { AUTH_TOKEN_USER } from "../../constants";
import "./home-page-container.css";

export const HomePageContainer = () => {
  const userName = localStorage.getItem(AUTH_TOKEN_USER);
  return (
    <>
      <div className="listContainer">
        Welcome {userName}!
        <Link to="/expenses">
          <div className="listItem">
            Expenses &gt;
            <span className="red">3.660,00 kn</span>
          </div>
        </Link>
        <div className="listItem">
          Budget &gt;
          <span className="green">15.000,00 kn</span>
        </div>
      </div>
      <div className="actions">
        <div className="green">Add expense</div>
      </div>
    </>
  );
};
