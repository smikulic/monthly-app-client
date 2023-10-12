import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { IconStyled, ListItemHeaderStyled } from "./list-item-header-style";

interface Props {
  title: string;
  showExpand?: boolean;
  showCollapse?: boolean;
  onToggleExpand?: () => void;
}

export const ListItemHeader: React.FC<Props> = ({
  title,
  showExpand,
  showCollapse,
  onToggleExpand,
}) => {
  return (
    <>
      {onToggleExpand && (
        <ListItemHeaderStyled onClick={onToggleExpand}>
          <IconStyled>
            {showExpand && <ExpandMoreIcon />}
            {showCollapse && <ChevronRightIcon />}
            {title}
          </IconStyled>
        </ListItemHeaderStyled>
      )}
      {!onToggleExpand && (
        <ListItemHeaderStyled>
          <IconStyled>{title}</IconStyled>
        </ListItemHeaderStyled>
      )}
    </>
  );
};
