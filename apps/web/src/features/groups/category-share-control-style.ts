import { styled } from "@mui/material/styles";
import { tokens } from "@/theme/tokens";

export const CategoryShareTriggerStyled = styled("button")(({ theme }) => ({
  border: "none",
  background: "none",
  padding: 0,
  marginRight: theme.spacing(1),
  cursor: "pointer",
  fontSize: tokens.fontSize.xs,
  whiteSpace: "nowrap",
  color: theme.palette.secondary.main,

  "&:hover": {
    textDecoration: "underline",
  },
}));
