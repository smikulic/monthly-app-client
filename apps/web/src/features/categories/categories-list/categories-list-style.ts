import { styled } from "@mui/material/styles";

export const CategoryDetailsStyled = styled("div")({
  display: "flex",
  alignItems: "center",
});

export const CategoryAmountStyled = styled("div")(({ theme }) => ({
  fontSize: "16px",
  color: theme.palette.money.neutral,
}));
