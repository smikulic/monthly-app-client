// src/components/ui/IconButton.tsx
import React from "react";
import { IconButton as MuiIconButton, IconButtonProps } from "@mui/material";

export const IconButton: React.FC<IconButtonProps> = (props) => (
  <MuiIconButton {...props} />
);
