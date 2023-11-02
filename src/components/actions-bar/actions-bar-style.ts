import { styled } from "@mui/material/styles";

export const ActionsBarStyled = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "0 12px",
  height: "56px",
  fontSize: "18px",
});

export const MonthPaginationStyled = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "16px",
  width: "140px",
  color: "#181818",

  "& svg": {
    color: "#181818",
    borderRadius: "5px",
    cursor: "pointer",
  },
  "& svg:hover": {
    color: "#f199c0",
  },
});
