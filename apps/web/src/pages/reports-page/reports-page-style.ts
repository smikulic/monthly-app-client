import { styled } from "@mui/material/styles";

export const ReportsWrapperStyled = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const YearSelectStyled = styled("div")({
  width: 140,
});

// Stacked + full-width on mobile, inline + content-width on larger screens.
export const ButtonGroupStyled = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
  },
}));

export const SectionDividerStyled = styled("hr")(({ theme }) => ({
  width: "100%",
  margin: 0,
  border: "none",
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const HelperTextStyled = styled("p")(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
}));

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
