import { styled } from "@mui/material/styles";

export const ListItemHeaderStyled = styled("div")({
  width: "64%",
  cursor: "pointer",
});

export const IconStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",

  "& svg": {
    color: theme.palette.text.primary,
  },
}));
