import { Box } from "@/components/ui/Box";
import { styled } from "@mui/material/styles";

type InvestmentCurrentValueStyledProps = {
  positive: boolean;
};

export const InvestmentInitialAmountStyled = styled("div")({
  position: "relative",
  fontSize: "13px",
  color: "#666666",
});

export const InvestmentCurrentValueStyled = styled(
  "div"
)<InvestmentCurrentValueStyledProps>(({ positive }) => ({
  position: "relative",
  fontSize: "12px",
  color: positive ? "#7fb77e" : "#ff7777",
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
