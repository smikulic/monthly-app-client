import { styled } from "@mui/material/styles";

export const ActionsBarStyled = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 32px",
  height: "56px",
  fontSize: "18px",
});

export const MonthPaginationStyled = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "18px",
  width: "158px",
  color: "#181818",

  "& svg": {
    color: "#181818",
    borderRadius: "5px",
    cursor: "pointer",
  },
  "& svg:hover": {
    color: "#41efcd",
  },
});
