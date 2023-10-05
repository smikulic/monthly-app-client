import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Subcategory, useCreateExpenseMutation } from "../../generated/graphql";
import { SubcategoryDecoratedWithExpenses } from "../expenses-list/expenses-list";
import { FormDialog } from "../form-dialog/form-dialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

interface Props {
  subcategories: SubcategoryDecoratedWithExpenses[];
  currentDate: Date;
  closeForm: () => void;
  refetch: () => Promise<unknown>;
}

export const CreateExpenseForm: React.FC<Props> = ({
  subcategories,
  currentDate,
  closeForm,
  refetch,
}) => {
  const [formInvalid, setFormInvalid] = useState(true);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(currentDate);
  const [expenseSubcategoryId, setExpenseSubcategoryId] = useState("");

  const [createExpense] = useCreateExpenseMutation({
    onCompleted: ({ createExpense }) => {
      refetch();
      closeForm();
      setExpenseAmount("");
      setExpenseDate(currentDate);
      setExpenseSubcategoryId("");
      toast.success(`You have successfully created a new expense!`);
      console.log(`Expense ${createExpense.id} created!`);
    },
  });

  useEffect(() => {
    if (!expenseAmount || !expenseDate || !expenseSubcategoryId) {
      setFormInvalid(true);
    } else {
      setFormInvalid(false);
    }
  }, [expenseAmount, expenseDate, expenseSubcategoryId]);

  return (
    <FormDialog
      title="Create expense"
      disabled={formInvalid}
      formActionText="Create"
      closeForm={closeForm}
      formAction={() =>
        createExpense({
          variables: {
            subcategoryId: expenseSubcategoryId,
            amount: Number(expenseAmount),
            date: String(expenseDate),
          },
        })
      }
    >
      <TextField
        required
        id="amount"
        label="Amount"
        size="small"
        margin="none"
        autoComplete="off"
        onChange={(e) => setExpenseAmount(e.target.value)}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date"
          value={expenseDate}
          onChange={(newValue) => (newValue ? setExpenseDate(newValue) : null)}
        />
      </LocalizationProvider>

      <FormControl size="small" margin="dense">
        <InputLabel>Subcategory</InputLabel>
        <Select
          required
          id="subcategory"
          label="Subcategory"
          margin="none"
          value={expenseSubcategoryId}
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
    </FormDialog>
  );
};
