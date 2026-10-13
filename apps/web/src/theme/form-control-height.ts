import type { Theme } from "@mui/material/styles";
import { tokens } from "./tokens";

/**
 * One definition of how tall a form control is.
 *
 * Text fields, selects and the date picker each had their own copy of this,
 * written against different elements — `TextFieldStyled` styled a FormControl
 * root and reached the input through a descendant selector, `SelectStyled`
 * styled the input directly, and the date picker kept a private duplicate with
 * the number hardcoded. They drifted, which is why a form ended up with rows of
 * three different heights.
 *
 * Every rule here is written to apply whether the generated class lands on the
 * outer FormControl or on the input itself, so it holds regardless of which
 * element a given wrapper hands it to.
 */
export const formControlHeight = (theme: Theme) => {
  const desktop = tokens.controlHeight + 4;
  const mobile = tokens.controlHeightMobile;

  const at = (height: number) => ({
    height,
    // When the class lands on a FormControl, the input is a descendant.
    "& .MuiOutlinedInput-root": { height, borderRadius: "10px" },
    // When it lands on the input itself, it *is* the root.
    "&.MuiOutlinedInput-root": { height, borderRadius: "10px" },
    // The Select's display area has its own padding and will not fill a taller
    // box on its own.
    "& .MuiSelect-select": { display: "flex", alignItems: "center" },
  });

  return {
    ...at(desktop),
    // A thumb is not a pointer: 40px sat under both Apple's 44pt and
    // Material's 48dp minimums.
    [theme.breakpoints.down("sm")]: at(mobile),
  };
};
