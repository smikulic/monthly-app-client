import { styled } from "@mui/material/styles";
import { tokens } from "@/theme/tokens";
import { ListItemStyled } from "../../shared";

// Expense leaf row (level 2): borderless, indented deepest, divided by a
// hairline. Sits inside the category group card under its subcategory.
export const ExpenseListItemStyled = styled(ListItemStyled)(({ theme }) => ({
  minHeight: "40px",
  padding: "8px 16px 8px 50px",
  fontSize: tokens.fontSize.sm,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const ExpenseFieldStyled = styled("div")(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: tokens.fontSize.sm,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  minWidth: 0,
  flex: 1,
}));
