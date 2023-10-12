import { styled } from "@mui/material/styles";

type BudgetAmountStyledProps = {
  positive: boolean;
};

type ExpenseAmountStyledProps = {
  prominent: boolean;
};

export const BudgetAmountStyled = styled("div")<BudgetAmountStyledProps>(
  ({ positive }) => ({
    position: "absolute",
    top: "28px",
    right: "32px",
    fontSize: "14px",
    color: positive ? "#7fb77e" : "#ff7777",
  })
);

export const ExpenseAmountStyled = styled("div")<ExpenseAmountStyledProps>(
  ({ prominent }) => ({
    position: "absolute",
    top: prominent ? "18px" : "10px",
    right: "32px",
    fontSize: prominent ? "16px" : "14px",
    color: "#181818",
  })
);
