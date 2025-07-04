// src/components/ui/Switch.tsx
import React from "react";
import { Switch as MuiSwitch, SwitchProps } from "@mui/material";

export const Switch: React.FC<SwitchProps> = (props) => (
  <MuiSwitch {...props} />
);
