// src/components/ui/Avatar.tsx
import React from "react";
import { Avatar as MuiAvatar, AvatarProps } from "@mui/material";

// Generic Avatar component
export const Avatar: React.FC<AvatarProps> = (props) => (
  <MuiAvatar {...props} />
);