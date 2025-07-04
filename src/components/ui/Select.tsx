// src/components/ui/Select.tsx
import React from "react";
import {
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
  SelectChangeEvent,
} from "@mui/material";
import { FormControl } from "./FormControl";
import { InputLabel } from "./InputLabel";

// Re-export types
export type { SelectChangeEvent };

// Individual component exports
export const Select = <T,>(props: MuiSelectProps<T>) => (
  <MuiSelect {...props} />
);

// Composed SelectField component
type SelectFieldProps = Omit<MuiSelectProps<string>, "native"> & {
  label: string;
  id: string;
};

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  children,
  ...rest
}) => (
  <FormControl fullWidth margin="normal">
    <InputLabel htmlFor={id}>{label}</InputLabel>
    <Select label={label} id={id} {...rest}>
      {children}
    </Select>
  </FormControl>
);
