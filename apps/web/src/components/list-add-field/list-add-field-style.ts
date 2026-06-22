import { styled } from "@mui/material/styles";

type ListAddFieldStyledProps = {
  indent?: boolean;
};

export const ListAddFieldStyled = styled("div")<ListAddFieldStyledProps>(
  ({ theme, indent }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
    height: "40px",
    position: "relative",
    margin: indent ? "8px 12px 8px 48px" : "8px 12px",
    padding: "8px 16px",
    fontWeight: 500,

    color: theme.palette.primary.contrastText,
    border: `1px solid ${theme.palette.primary.main}`,
    background: "transparent",
    borderRadius: "12px",
    cursor: "pointer",

    "& svg": {
      fontSize: "18px",
      color: theme.palette.primary.main,
    },

    "&:hover": {
      borderColor: theme.palette.primary.main,
      background: "rgba(59, 206, 177, 0.08)",
    },
  }),
);
