import { styled } from "@mui/material/styles";

type ListAddFieldStyledProps = {
  indent?: boolean;
};

export const ListAddFieldStyled = styled("div")<ListAddFieldStyledProps>(
  ({ theme, indent }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "48px",
    position: "relative",
    margin: indent ? "12px 12px 12px 48px" : "12px",
    padding: "14px 24px",

    color: theme.palette.primary.contrastText,
    border: `1px solid ${theme.palette.primary.contrastText}`,
    background: theme.palette.primary.main,
    borderRadius: "16px",
    cursor: "pointer",

    "&:hover": {
      opacity: 0.7,
    },
  })
);
