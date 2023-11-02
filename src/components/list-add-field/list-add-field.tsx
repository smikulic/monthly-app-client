import React from "react";
import { ListAddFieldStyled } from "./list-add-field-style";
import { Typography } from "@mui/material";

interface Props {
  text: string;
  indent?: boolean;
  onClick: () => void;
}

export const ListAddField: React.FC<Props> = ({ text, indent, onClick }) => {
  return (
    <ListAddFieldStyled indent={indent} onClick={onClick}>
      <Typography fontSize={16} noWrap>
        {text}
      </Typography>
    </ListAddFieldStyled>
  );
};
