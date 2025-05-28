// src/components/ui/DatePickerStyled.tsx
import { styled } from "@mui/system";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";

// 1) Create a TextField styled exactly like your SelectStyled
const DateFieldStyled = styled(TextField)(({ theme }) => ({
  height: "40px",
  borderRadius: "10px",

  "& .MuiOutlinedInput-root": {
    height: "100%",
    borderRadius: "10px",
  },
}));

// 2) Wrap DatePicker, exposing the same generic as the original
export function DatePickerStyled<
  TDate = unknown,
  TView extends "year" | "month" | "day" = "day"
>(props: any) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        {...props}
        slots={{
          textField: DateFieldStyled,
        }}
      />
    </LocalizationProvider>
  );
}
