// src/components/ui/DatePickerStyled.tsx
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { formControlHeight } from "@/theme/form-control-height";

// 1) Create a TextField styled exactly like your SelectStyled
// Shares its height with every other control rather than keeping a private
// copy of the number, which is how it ended up shorter than the fields above
// and below it.
const DateFieldStyled = styled(TextField)(({ theme }) =>
  formControlHeight(theme),
);

// 2) Wrap DatePicker, exposing the same generic as the original

export function DatePickerStyled<
  TDate = unknown,
  TView extends "year" | "month" | "day" = "day",
>(props: {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  /** Budget periods start on a month, so those drop the day view. */
  views?: ("year" | "month" | "day")[];
  format?: string;
  /** Sizing when the picker shares a row with other controls. */
  sx?: SxProps<Theme>;
  // …any other DatePicker props you need
}) {
  const { value, onChange, ...other } = props;
  const dayjsValue = value ? dayjs(value) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        /*
         * European order, not the adapter's US default.
         *
         * It was rendering `10/14/2026`, which to anyone in Zagreb, Ljubljana
         * or Berlin reads as the 10th of a fourteenth month — ambiguous at
         * best and silently wrong at worst, in an app where the date decides
         * which month an expense lands in. Same character count, no ambiguity.
         *
         * Becomes the user's own locale once `User.locale` exists; until then
         * this is right for every market the product is aimed at.
         */
        format="DD.MM.YYYY"
        {...other}
        value={dayjsValue}
        onChange={(newVal: Dayjs | null) => {
          onChange(newVal ? newVal.toDate() : null);
        }}
        // ← opt out of the new accessible DOM structure
        enableAccessibleFieldDOMStructure={false}
        // swap in your styled TextField
        slots={{ textField: DateFieldStyled }}
      />
    </LocalizationProvider>
  );
}
