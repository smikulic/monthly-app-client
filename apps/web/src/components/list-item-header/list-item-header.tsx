import { FC, ReactNode } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { IconStyled, ListItemHeaderStyled } from "./list-item-header-style";
import { Typography } from "@/components/ui/Typography";

interface Props {
  title: string;
  showExpand?: boolean;
  showCollapse?: boolean;
  onToggleExpand?: () => void;
  // Optional marker rendered next to the title (e.g. a shared-group badge).
  badge?: ReactNode;
}

export const ListItemHeader: FC<Props> = ({
  title,
  showExpand,
  showCollapse,
  onToggleExpand,
  badge,
}) => {
  return (
    <>
      {onToggleExpand && (
        <ListItemHeaderStyled onClick={onToggleExpand}>
          <IconStyled>
            {showExpand && <ExpandMoreIcon />}
            {showCollapse && <ChevronRightIcon />}
            <Typography noWrap>{title}</Typography>
            {badge}
          </IconStyled>
        </ListItemHeaderStyled>
      )}
      {!onToggleExpand && (
        <ListItemHeaderStyled>
          <IconStyled>
            <Typography noWrap>{title}</Typography>
            {badge}
          </IconStyled>
        </ListItemHeaderStyled>
      )}
    </>
  );
};
