import { styled } from "@mui/material/styles";

export const FooterStyled = styled("div")(({ theme }) => ({
  position: "fixed",
  bottom: "0",
  padding: "10px",
  width: "100%",
  textAlign: "center",
  background: theme.palette.ground,
  borderTop: `1px solid ${theme.palette.divider}`,

  a: {
    color: theme.palette.primary.main,
    fontSize: "13px",
    textDecoration: "none",
  },
}));
