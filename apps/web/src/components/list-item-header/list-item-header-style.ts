import { styled } from "@mui/material/styles";

export const ListItemHeaderStyled = styled("div")({
  width: "64%",
  cursor: "pointer",
  // Above the progress wash, which is absolutely positioned across the row.
  position: "relative",
  zIndex: 1,
});

export const IconStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",

  "& svg": {
    color: theme.palette.text.primary,
  },
}));
