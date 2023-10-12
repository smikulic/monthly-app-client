import { styled } from "@mui/material/styles";
import { ListItemStyled } from "../../shared";

export const ExpenseListItemStyled = styled(ListItemStyled)({
  height: "48px",
  padding: "8px 18px 8px 56px",
  fontSize: "15px",
});

export const ExpenseFieldStyled = styled("div")({
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  paddingLeft: "24px",
});
