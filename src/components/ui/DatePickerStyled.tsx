// src/components/ui/DatePickerStyled.tsx
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import { styled } from "@mui/system";

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
>(props: {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  // …any other DatePicker props you need
}) {
  const { value, onChange, ...other } = props;
  const dayjsValue = value ? dayjs(value) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
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
