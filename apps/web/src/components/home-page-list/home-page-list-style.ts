import { styled } from "@mui/material/styles";

export const HomeContainerStyled = styled("div")(({ theme }) => ({
  display: "grid",
  gap: "14px",
  // Right/bottom padding also gives the tiles' 4px offset shadow room so it is
  // not clipped at the viewport edge.
  padding: "10px 14px 14px",

  // One column on phones, two from `sm` up. `minmax(0, 1fr)` is the important
  // part: a bare `1fr` track refuses to shrink below its content width, which
  // is what pushed the Investments tile off screen.
  gridTemplateColumns: "minmax(0, 1fr)",
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
}));

export const HomeChartTotalValueStyled = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});
