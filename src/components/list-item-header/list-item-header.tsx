import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { styled } from "@mui/material/styles";

const IconStyled = styled("div")({
  display: "flex",
  alignItems: "center",

  "& svg": {
    color: "#277bc0",
  },
});

interface Props {
  title: string;
  showExpand: boolean;
  showCollapse: boolean;
  onToggleExpand: () => void;
}

export const ListItemHeader: React.FC<Props> = ({
  title,
  showExpand,
  showCollapse,
  onToggleExpand,
}) => {
  return (
    <div className="categoryTitle" onClick={onToggleExpand}>
      <IconStyled>
        {showExpand && <ExpandMoreIcon />}
        {showCollapse && <ChevronRightIcon />}
        {title}
      </IconStyled>
    </div>
  );
};
