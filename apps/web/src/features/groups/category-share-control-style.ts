import { styled } from "@mui/material/styles";

export const CategoryShareTriggerStyled = styled("button")(({ theme }) => ({
  border: "none",
  background: "none",
  padding: 0,
  marginRight: theme.spacing(1),
  cursor: "pointer",
  fontSize: "12px",
  whiteSpace: "nowrap",
  color: theme.palette.secondary.main,

  "&:hover": {
    textDecoration: "underline",
  },
}));
