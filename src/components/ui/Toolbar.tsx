// src/components/ui/Toolbar.tsx
import React from "react";
import { Toolbar as MuiToolbar, ToolbarProps } from "@mui/material";

export const Toolbar: React.FC<ToolbarProps> = (props) => (
  <MuiToolbar {...props} />
);
