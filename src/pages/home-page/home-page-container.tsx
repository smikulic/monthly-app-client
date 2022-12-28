import React from "react";
import { Link } from "react-router-dom";

export const HomePageContainer = () => {
  return (
    <div className="homeContainer">
      <div className="listContainer">
        <Link to="/expenses">
          <div className="listItem">
            Expenses
            <span className="red">3.660,00 € (mock)</span>
          </div>
        </Link>
        <Link to="/categories">
          <div className="listItem">
            Categories/Budget
            <span className="orange">15.000,00 € (mock)</span>
          </div>
        </Link>
      </div>
      <div className="actions">
        <div className="green">Add expense</div>
      </div>
    </div>
  );
};
