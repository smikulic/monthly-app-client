import { Box } from "@/components/ui/Box";
import { styled } from "@mui/material/styles";
import { tokens } from "@/theme/tokens";

type InvestmentCurrentValueStyledProps = {
  positive: boolean;
};

export const InvestmentInitialAmountStyled = styled("div")({
  position: "relative",
  fontSize: tokens.fontSize.sm,
  color: "#666666",
});

export const InvestmentCurrentValueStyled = styled(
  "div",
)<InvestmentCurrentValueStyledProps>(({ theme, positive }) => ({
  position: "relative",
  fontSize: tokens.fontSize.xs,
  color: positive ? theme.palette.money.positive : theme.palette.money.negative,
  fontWeight: 500,
}));

export const InvestmentItemDetailsContainerStyled = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "end",
  justifyContent: "center",
  position: "relative",
  height: "42px",
  gap: "2px",
});
