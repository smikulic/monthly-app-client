import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import {
  Expense,
  Subcategory,
  useUpdateExpenseMutation,
} from "../../generated/graphql";
import { FormDialog } from "../form-dialog/form-dialog";

interface Props {
  open: boolean;
  formData: Expense;
  subcategories: Subcategory[];
  closeForm: () => void;
  refetch: () => Promise<unknown>;
}

export const UpdateExpenseForm: React.FC<Props> = ({
  open,
  formData,
  subcategories,
  closeForm,
  refetch,
}) => {
  const formExpenseDate = new Date(parseInt(formData.date, 10));

  const [formInvalid, setFormInvalid] = useState(true);
  const [expenseAmount, setExpenseAmount] = useState(formData.amount);
  const [expenseDate, setExpenseDate] = useState(formExpenseDate);
  const [expenseSubcategoryId, setExpenseSubcategoryId] = useState(
    formData.subcategoryId
  );

  const [updateExpense] = useUpdateExpenseMutation({
    onCompleted: ({ updateExpense }) => {
      refetch();
      closeForm();
      setExpenseSubcategoryId("");
      setExpenseDate(new Date());
      setExpenseAmount(0);
      toast.success(
        `You have successfully updated ${updateExpense.id} expense!`
      );
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
      open={open}
      title="Expense"
      disabled={formInvalid}
      formActionText="Save"
      closeForm={closeForm}
      formAction={() =>
        updateExpense({
          variables: {
            id: formData.id,
            amount: expenseAmount,
            date: String(expenseDate),
            subcategoryId: expenseSubcategoryId,
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
        value={expenseAmount}
        onChange={(e) => setExpenseAmount(Number(e.target.value))}
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
