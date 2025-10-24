// src/components/ui/Menu.tsx
import React from "react";
import {
  Menu as MuiMenu,
  MenuProps,
  ListItemIcon as MuiListItemIcon,
  ListItemIconProps,
} from "@mui/material";

export const Menu: React.FC<MenuProps> = (props) => <MuiMenu {...props} />;
export const ListItemIcon: React.FC<ListItemIconProps> = (props) => (
  <MuiListItemIcon {...props} />
);
