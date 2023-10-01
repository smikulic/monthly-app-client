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
    height: "52px",
    position: "relative",
    padding: indent ? "16px 32px 16px 56px" : "16px 32px",
    fontSize: fontSize === "small" ? "16px" : "20px",
    borderBottom: "1px solid rgb(223, 223, 223)",
    cursor: "pointer",
    opacity: "0.7",

    "& svg": {
      position: "relative",
      color: "#7fb77e",
      right: "4px",
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
