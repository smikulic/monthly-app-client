import { FC, MouseEvent, ReactNode } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { AnchorActionDropdownElProps } from "../../hooks/useActionDropdown";

interface Props {
  itemId: string;
  anchorActionDropdownEl: AnchorActionDropdownElProps;
  handleOnEdit: () => void;
  handleOnRemove: () => void;
  handleOnOpenMenu: (event: MouseEvent<HTMLElement>) => void;
  handleOnCloseMenu: () => void;
  // Optional extra menu entries (e.g. share/unshare for categories).
  extraItems?: ReactNode;
}

export const IconMenu: FC<Props> = ({
  itemId,
  anchorActionDropdownEl,
  handleOnEdit,
  handleOnRemove,
  handleOnOpenMenu,
  handleOnCloseMenu,
  extraItems,
}) => {
  return (
    <div>
      <IconButton
        id={`long-menu-icon-${itemId}`}
        aria-haspopup="true"
        size="small"
        onClick={handleOnOpenMenu}
        data-testid={`menu-button-${itemId}`}
        aria-label="More options"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`long-menu-${itemId}`}
        anchorEl={anchorActionDropdownEl[itemId]}
        open={Boolean(anchorActionDropdownEl[itemId])}
        onClose={handleOnCloseMenu}
      >
        <MenuItem onClick={handleOnEdit}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        {extraItems}
        <MenuItem onClick={handleOnRemove} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          Remove
        </MenuItem>
      </Menu>
    </div>
  );
};
