import { styled } from "@mui/material/styles";

type BudgetAmountStyledProps = {
  positive: boolean;
};

type ExpenseAmountStyledProps = {
  prominent: boolean;
};

export const BudgetAmountStyled = styled("div")<BudgetAmountStyledProps>(
  ({ positive }) => ({
    position: "relative",
    // top: "38px",
    // right: "64px",
    fontSize: "14px",
    color: positive ? "#7fb77e" : "#ff7777",
  })
);

export const ExpenseAmountStyled = styled("div")<ExpenseAmountStyledProps>(
  ({ prominent }) => ({
    position: "relative",
    // top: prominent ? "18px" : "18px",
    // right: "64px",
    fontSize: prominent ? "16px" : "14px",
    color: "#181818",
  })
);
