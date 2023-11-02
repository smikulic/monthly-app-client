import { styled } from "@mui/material/styles";
import { ListItemStyled } from "../../shared";

export const ExpenseListItemStyled = styled(ListItemStyled)({
  height: "44px",
  margin: "8px 12px",
  padding: "8px 18px 8px 38px",
  fontSize: "15px",
  border: "1px solid #d6d7e0",
  borderRadius: "16px",
});

export const ExpenseFieldStyled = styled("div")({
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  paddingLeft: "24px",
  color: "#878BAC",
  fontSize: "14px",
});
