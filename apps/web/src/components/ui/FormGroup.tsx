// src/components/ui/FormGroup.tsx
import React from "react";
import { FormGroup as MuiFormGroup, FormGroupProps } from "@mui/material";

export const FormGroup: React.FC<FormGroupProps> = (props) => (
  <MuiFormGroup {...props} />
);
