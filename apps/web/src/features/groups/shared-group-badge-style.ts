import { styled } from "@mui/material/styles";

export const SharedGroupBadgeStyled = styled("span")(({ theme }) => ({
  marginLeft: theme.spacing(1),
  padding: "2px 8px",
  borderRadius: "10px",
  fontSize: "11px",
  fontWeight: 500,
  whiteSpace: "nowrap",
  color: theme.palette.secondary.main,
  border: `1px solid ${theme.palette.secondary.main}`,
}));
