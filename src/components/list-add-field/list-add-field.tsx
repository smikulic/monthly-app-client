import React from "react";
import { styled } from "@mui/material/styles";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

type ListAddFieldStyledProps = {
  indent?: boolean;
  fontSize: "small" | "medium";
};

const ListAddFieldStyled = styled("div")<ListAddFieldStyledProps>(
  ({ indent, fontSize }) => ({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "48px",
    position: "relative",
    margin: indent ? "12px 12px 12px 48px" : "12px",
    padding: "14px 32px",
    fontSize: fontSize === "small" ? "16px" : "18px",
    borderBottom: "1px solid rgb(223, 223, 223)",

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

interface Props {
  text: string;
  fontSize?: "small" | "medium";
  indent?: boolean;
  onClick: () => void;
}

export const ListAddField: React.FC<Props> = ({
  text,
  fontSize = "medium",
  indent,
  onClick,
}) => {
  return (
    <ListAddFieldStyled indent={indent} fontSize={fontSize} onClick={onClick}>
      <AddCircleRoundedIcon />
      {text}
    </ListAddFieldStyled>
  );
};
