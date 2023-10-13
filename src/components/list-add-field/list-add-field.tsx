import React from "react";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { ListAddFieldStyled } from "./list-add-field-style";
import { Typography } from "@mui/material";

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
      <Typography noWrap>{text}</Typography>
    </ListAddFieldStyled>
  );
};
