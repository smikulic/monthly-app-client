// src/components/ui/FormControl.tsx
import React from "react";
import {
  FormControl as MuiFormControl,
  FormControlProps,
  FormControlLabel as MuiFormControlLabel,
  FormControlLabelProps,
} from "@mui/material";

export const FormControl: React.FC<FormControlProps> = (props) => (
  <MuiFormControl {...props} />
);
export const FormControlLabel: React.FC<FormControlLabelProps> = (props) => (
  <MuiFormControlLabel {...props} />
);
