import React, { useEffect, useState } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Subcategory, useCreateExpenseMutation } from "../../generated/graphql";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { SubcategoryDecoratedWithExpenses } from "../expenses-list/expenses-list";

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
    <>
      <DialogTitle>Update expense</DialogTitle>
      <IconButton
        onClick={closeForm}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Stack spacing={1}>
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
              onChange={(newValue) =>
                newValue ? setExpenseDate(newValue) : null
              }
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
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: "0 24px 16px 24px" }}>
        <Button variant="outlined" color="warning" onClick={closeForm}>
          Cancel
        </Button>
        <Button
          fullWidth
          variant="contained"
          disabled={formInvalid}
          onClick={() =>
            createExpense({
              variables: {
                subcategoryId: expenseSubcategoryId,
                amount: Number(expenseAmount),
                date: String(expenseDate),
              },
            })
          }
        >
          Create
        </Button>
      </DialogActions>
    </>
  );
};
