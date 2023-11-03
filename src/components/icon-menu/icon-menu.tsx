import React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AnchorActionDropdownElProps } from "../../hooks/useActionDropdown";

interface Props {
  itemId: string;
  anchorActionDropdownEl: AnchorActionDropdownElProps;
  handleOnEdit: () => void;
  handleOnRemove: () => void;
  handleOnOpenMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleOnCloseMenu: () => void;
}

export const IconMenu: React.FC<Props> = ({
  itemId,
  anchorActionDropdownEl,
  handleOnEdit,
  handleOnRemove,
  handleOnOpenMenu,
  handleOnCloseMenu,
}) => {
  return (
    <div>
      <IconButton
        id={`long-menu-icon-${itemId}`}
        aria-haspopup="true"
        size="small"
        onClick={handleOnOpenMenu}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`long-menu-${itemId}`}
        anchorEl={anchorActionDropdownEl[itemId]}
        open={Boolean(anchorActionDropdownEl[itemId])}
        onClose={handleOnCloseMenu}
      >
        <MenuItem onClick={handleOnEdit}>Edit</MenuItem>
        <MenuItem onClick={handleOnRemove}>Remove</MenuItem>
      </Menu>
    </div>
  );
};
