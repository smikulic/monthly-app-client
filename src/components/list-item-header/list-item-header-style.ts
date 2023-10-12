import { styled } from "@mui/material/styles";

export const ListItemHeaderStyled = styled("div")({
  cursor: "pointer",
});

export const IconStyled = styled("div")({
  display: "flex",
  alignItems: "center",

  "& svg": {
    color: "#181818",
  },
});
