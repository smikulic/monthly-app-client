import { styled } from "@mui/material/styles";

export const ActionsBarStyled = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "0 12px",
  height: "56px",
  fontSize: "18px",
});

export const MonthPaginationStyled = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "17px",
  width: "148px",
  color: theme.palette.primary.contrastText,

  "& svg": {
    color: theme.palette.primary.contrastText,
    borderRadius: "5px",
    cursor: "pointer",
  },
  "& svg:hover": {
    color: theme.palette.secondary.main,
  },
}));
