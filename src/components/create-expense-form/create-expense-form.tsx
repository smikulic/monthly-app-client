import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { Subcategory, useCreateExpenseMutation } from "../../generated/graphql";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

interface Props {
  subcategories: Subcategory[];
  currentDate: Date;
  refetchExpenses: () => Promise<unknown>;
  closeForm: () => void;
}

export const CreateExpenseForm: React.FC<Props> = ({
  subcategories,
  currentDate,
  refetchExpenses,
  closeForm,
}) => {
  const [formInvalid, setFormInvalid] = useState(true);
  const [newExpenseAmount, setExpenseAmount] = useState("");
  const [newExpenseDate, setExpenseDate] = useState(currentDate);
  const [newExpenseSubcategoryId, setExpenseSubcategoryId] = useState("");

  const [createExpense, { loading }] = useCreateExpenseMutation({
    onCompleted: ({ createExpense }) => {
      refetchExpenses();
      closeForm();
      setExpenseAmount("");
      setExpenseDate(currentDate);
      setExpenseSubcategoryId("");
      toast.success(`You have successfully created a new expense!`);
      console.log(`Expense ${createExpense.id} created!`);
    },
  });

  useEffect(() => {
    if (!newExpenseAmount || !newExpenseDate || !newExpenseSubcategoryId) {
      setFormInvalid(true);
    } else {
      setFormInvalid(false);
    }
  }, [newExpenseAmount, newExpenseDate, newExpenseSubcategoryId]);

  return (
    <>
      <TextField
        required
        id="amount"
        label="Amount"
        size="small"
        margin="normal"
        onChange={(e) => setExpenseAmount(e.target.value)}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date"
          value={currentDate}
          onChange={(newValue) => (newValue ? setExpenseDate(newValue) : null)}
        />
      </LocalizationProvider>

      <FormControl size="small" margin="dense">
        <InputLabel>Subcategory</InputLabel>
        <Select
          id="subcategory"
          label="Subcategory"
          value={newExpenseSubcategoryId}
          onChange={(e: SelectChangeEvent) => {
            setExpenseSubcategoryId(e.target.value);
          }}
        >
          {subcategories.map((subcategory: Subcategory) => {
            const subcategoryId = subcategory.id;
            return (
              <MenuItem key={subcategoryId} value={subcategoryId}>
                {subcategory.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <Stack spacing={1} direction="row">
        <Button variant="outlined" color="warning" onClick={closeForm}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={formInvalid}
          onClick={() =>
            createExpense({
              variables: {
                subcategoryId: newExpenseSubcategoryId,
                amount: Number(newExpenseAmount),
                date: String(newExpenseDate),
              },
            })
          }
        >
          {loading ? "saving..." : "Create"}
        </Button>
      </Stack>
    </>
  );
};
