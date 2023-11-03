import React from "react";
import { Alert, AlertTitle } from "@mui/material";

export const ExpensesListNoData: React.FC = () => {
  return (
    <Alert severity="info">
      <AlertTitle>
        Create a category and subcategory to enable adding an expense.
      </AlertTitle>
      <strong>Example:</strong> "Food" can be category, "Groceries" and
      "Restaurant" subcategories.
      <br />
      Or to keep it simple, just create a subcategory "all"
    </Alert>
  );
};
