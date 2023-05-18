import React from "react";
import { Link } from "react-router-dom";
import { formatAmount } from "../../utils/format";

export const HomePage = ({
  totalExpensesAmount,
  totalBudgetAmount,
}: {
  totalExpensesAmount: number;
  totalBudgetAmount: number;
}) => {
  return (
    <div className="homeContainer">
      <div className="listContainer">
        <Link to="/expenses">
          <div className="listItem">
            Expenses
            <span className="red">{formatAmount(totalExpensesAmount)}</span>
          </div>
        </Link>
        <Link to="/categories">
          <div className="listItem">
            Categories/Budget
            <span className="orange">{formatAmount(totalBudgetAmount)}</span>
          </div>
        </Link>
      </div>
    </div>
  );
};
