import { styled } from "@mui/material/styles";
import { ListItemStyled } from "../../shared";

// Expense leaf row (level 2): borderless, indented deepest, divided by a
// hairline. Sits inside the category group card under its subcategory.
export const ExpenseListItemStyled = styled(ListItemStyled)(({ theme }) => ({
  minHeight: "40px",
  padding: "8px 16px 8px 50px",
  fontSize: "14px",
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const ExpenseFieldStyled = styled("div")({
  color: "#878BAC",
  fontSize: "14px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  minWidth: 0,
  flex: 1,
});
