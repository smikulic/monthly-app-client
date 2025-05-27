// src/components/ui/Box.tsx
import React from "react";
import { Box as MuiBox, BoxProps } from "@mui/material";

/**
 * A thin wrapper around MUI Box to centralize default layout behavior.
 */
export const Box: React.FC<BoxProps> = (props) => <MuiBox {...props} />;
