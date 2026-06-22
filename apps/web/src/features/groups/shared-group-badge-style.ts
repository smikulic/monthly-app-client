import { styled } from "@mui/material/styles";

export const SharedGroupBadgeStyled = styled("span")(({ theme }) => ({
  marginLeft: theme.spacing(1),
  padding: "2px 8px",
  borderRadius: "6px",
  fontSize: "11px",
  letterSpacing: "0.02em",
  whiteSpace: "nowrap",
  color: "#c43d80",
  background: "rgba(241, 153, 192, 0.18)",
}));
