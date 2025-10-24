// src/components/ui/MenuItem.tsx
import { MenuItem as MuiMenuItem, MenuItemProps } from "@mui/material";

export const MenuItem: React.FC<MenuItemProps> = (props) => (
  <MuiMenuItem {...props} />
);
