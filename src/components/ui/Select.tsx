// src/components/ui/Select.tsx
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  SelectProps,
  MenuItem,
} from "@mui/material";

type SelectFieldProps = Omit<SelectProps<string>, "native"> & {
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
    <MuiSelect label={label} id={id} {...rest}>
      {children}
    </MuiSelect>
  </FormControl>
);
