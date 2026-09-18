import { useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { getCurrencyOptions, type CurrencyOption } from "@/utils/currencies";

/**
 * Searchable picker over every ISO 4217 currency.
 *
 * A plain Select worked when the list was six hardcoded codes, but not for
 * ~300 — and the short list was the wrong answer anyway: plenty of people in
 * Zagreb and Berlin want to track in the currency they earn in.
 *
 * The roadmap markets and their neighbours are surfaced first so the common
 * case needs no typing, and searching matches either the code or the name.
 */
export const CurrencySelect = ({
  value,
  onChange,
  label = "Currency",
}: {
  value: string;
  onChange: (code: string) => void;
  label?: string;
}) => {
  const options = useMemo(() => {
    const all = getCurrencyOptions();
    // A stored code the runtime does not know — a legacy value, or one from an
    // older ICU — would leave no match, and with `disableClearable` that makes
    // the field uncontrolled. Carry it as its own option instead.
    return all.some((o) => o.code === value)
      ? all
      : [{ code: value, name: value, label: value }, ...all];
  }, [value]);

  const selected = options.find((o) => o.code === value);

  return (
    <Autocomplete
      options={options}
      value={selected}
      onChange={(_, next) => next && onChange(next.code)}
      // Never offer an empty currency: clearing it would leave amounts with no
      // unit at all.
      disableClearable
      autoHighlight
      getOptionLabel={(option: CurrencyOption) => option.label}
      isOptionEqualToValue={(option, val) => option.code === val.code}
      renderInput={(params) => (
        <TextField {...params} label={label} size="small" />
      )}
      slotProps={{ listbox: { style: { maxHeight: 320 } } }}
      data-testid="currency-select"
    />
  );
};
