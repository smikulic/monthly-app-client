import { styled } from "@mui/material/styles";

type ListAddFieldStyledProps = {
  indent?: boolean;
  fontSize: "small" | "medium";
};

export const ListAddFieldStyled = styled("div")<ListAddFieldStyledProps>(
  ({ indent, fontSize }) => ({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "48px",
    position: "relative",
    margin: indent ? "12px 12px 12px 48px" : "12px",
    padding: "14px 24px",
    fontSize: fontSize === "small" ? "16px" : "18px",

    color: "black",
    border: "1px solid black",
    borderRadius: "5px",

    cursor: "pointer",
    opacity: "0.7",

    "& svg": {
      position: "relative",
      color: "black",
      right: "6px",
      fontSize: fontSize === "small" ? "20px" : "24px",
    },
    "&:hover": {
      opacity: "1",
    },
  })
);
