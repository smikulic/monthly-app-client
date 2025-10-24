// src/components/ui/AppBar.tsx
import React from "react";
import { AppBar as MuiAppBar, AppBarProps } from "@mui/material";

export const AppBar: React.FC<AppBarProps> = (props) => (
  <MuiAppBar {...props} />
);
