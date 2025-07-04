// src/components/ui/Button.tsx
import React from "react";
import { Button as MuiButton, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

// Generic Button component
export const Button: React.FC<ButtonProps> = (props) => (
  <MuiButton {...props} />
);

export const PrimaryButton = styled((props: ButtonProps) => (
  <MuiButton variant="contained" {...props} />
))(({ theme }) => ({}));

export const OutlineButton = styled((props: ButtonProps) => (
  <MuiButton variant="outlined" {...props} />
))(({ theme }) => ({}));

export const DangerButton = styled((props: ButtonProps) => (
  <MuiButton variant="contained" color="error" {...props} />
))(({ theme }) => ({
  // you can add extra danger styles here
}));
