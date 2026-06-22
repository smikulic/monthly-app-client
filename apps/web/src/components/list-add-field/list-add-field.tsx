import { FC } from "react";
import AddIcon from "@mui/icons-material/Add";
import { ListAddFieldStyled } from "./list-add-field-style";
import { Typography } from "@/components/ui/Typography";

interface Props {
  text: string;
  indent?: boolean;
  onClick: () => void;
}

export const ListAddField: FC<Props> = ({ text, indent, onClick }) => {
  return (
    <ListAddFieldStyled
      indent={indent}
      onClick={onClick}
      data-testid="list-add-field"
    >
      <AddIcon />
      <Typography fontSize={16} noWrap>
        {text}
      </Typography>
    </ListAddFieldStyled>
  );
};
