// src/components/ui/TextField.tsx
import { TextField as MuiTextField, TextFieldProps } from "@mui/material";

export const TextField = (props: TextFieldProps) => (
  <MuiTextField fullWidth margin="normal" {...props} />
);
