import { FC } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { IconStyled, ListItemHeaderStyled } from "./list-item-header-style";
import { Typography } from "@/components/ui/Typography";

interface Props {
  title: string;
  showExpand?: boolean;
  showCollapse?: boolean;
  onToggleExpand?: () => void;
}

export const ListItemHeader: FC<Props> = ({
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
            <Typography noWrap>{title}</Typography>
          </IconStyled>
        </ListItemHeaderStyled>
      )}
      {!onToggleExpand && (
        <ListItemHeaderStyled>
          <IconStyled>
            <Typography noWrap>{title}</Typography>
          </IconStyled>
        </ListItemHeaderStyled>
      )}
    </>
  );
};
