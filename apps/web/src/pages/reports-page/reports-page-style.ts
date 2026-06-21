import { styled } from "@mui/material/styles";

export const YearSelectStyled = styled("div")({
  width: 140,
});

export const HiddenFileInputStyled = styled("input")({
  display: "none",
});

export const FileRowStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

export const FileNameStyled = styled("span")(({ theme }) => ({
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
}));
