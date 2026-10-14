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
    /*
     * The Select's display area has its own padding and will not fill a taller
     * box on its own.
     *
     * Block, not flex. `text-overflow: ellipsis` only applies to inline content
     * inside a block container, so making this a flex container silently
     * disabled MUI's own truncation — a value too long for the field was cut
     * off mid-character at the border instead of ellipsised, which is what an
     * email address in "Paid by" looked like on a phone.
     *
     * `line-height` does the vertical centring that flex was there for, and the
     * full height keeps the whole control tappable rather than just the strip
     * of text in the middle of it.
     */
    "& .MuiSelect-select": {
      display: "block",
      boxSizing: "border-box",
      height: "100%",
      lineHeight: `${height}px`,
      paddingTop: 0,
      paddingBottom: 0,
    },
  });

  return {
    ...at(desktop),
    // A thumb is not a pointer: 40px sat under both Apple's 44pt and
    // Material's 48dp minimums.
    [theme.breakpoints.down("sm")]: at(mobile),
  };
};
