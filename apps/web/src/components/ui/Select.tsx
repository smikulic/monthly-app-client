// src/components/ui/Select.tsx
import React from "react";
import {
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
  SelectChangeEvent,
} from "@mui/material";
import type { FormControlProps } from "@mui/material";
import { FormControl } from "./FormControl";
import { InputLabel } from "./InputLabel";

// Re-export types
export type { SelectChangeEvent };

// Individual component exports
export const Select = <T,>(props: MuiSelectProps<T>) => (
  <MuiSelect {...props} />
);

// Composed SelectField component
//
// `margin` is retyped for the FormControl, which is where callers have always
// meant it to land. On a Select it means something else entirely, and being
// swallowed by `...rest` is how `margin="none"` ended up doing nothing.
type SelectFieldProps = Omit<MuiSelectProps<string>, "native" | "margin"> & {
  label: string;
  id: string;
  margin?: FormControlProps["margin"];
};

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  children,
  /*
   * Small by default, because every one of these is styled to a 40px control
   * to sit on the toolbar baseline.
   *
   * Left unset, MUI assumed its default medium and positioned the resting
   * label with `translate(14px, 16px)` — the offset for a 56px field. In a
   * 40px one that puts the text straight through the outline, which is the
   * overlap you see before a value is chosen. The size has to be declared, not
   * just styled: MUI derives the label's transform from it, and CSS height
   * alone tells it nothing.
   */
  size = "small",
  margin = "normal",
  ...rest
}) => {
  /*
   * A Select is a div, not an input, so `htmlFor` alone does not name it —
   * MUI wires the label up through `labelId`, and without one it falls back to
   * pointing `aria-labelledby` at the Select's own id. Every select in the app
   * was therefore announced with no name at all: "combobox, blank".
   *
   * The label needs its own id for that to resolve, which is why this is two
   * changes rather than one.
   */
  const labelId = `${id}-label`;

  return (
    // `size` goes on the FormControl as well as the Select: InputLabel takes
    // its own metrics from FormControl's context, not from the Select.
    <FormControl fullWidth margin={margin} size={size}>
      <InputLabel id={labelId} htmlFor={id}>
        {label}
      </InputLabel>
      <Select labelId={labelId} label={label} id={id} size={size} {...rest}>
        {children}
      </Select>
    </FormControl>
  );
};
