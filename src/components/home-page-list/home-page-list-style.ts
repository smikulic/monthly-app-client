import { styled } from "@mui/material/styles";

export const HomeContainerStyled = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",

  "& a": {
    textDecoration: "none",
    color: "inherit",
  },
});

export const HomeChartTotalValueStyled = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});
