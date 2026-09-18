import { styled } from "@mui/material/styles";
import { tokens } from "@/theme/tokens";

export const CategoryDetailsStyled = styled("div")({
  display: "flex",
  alignItems: "center",
});

export const CategoryAmountStyled = styled("div")(({ theme }) => ({
  fontSize: tokens.fontSize.md,
  color: theme.palette.money.neutral,
}));
