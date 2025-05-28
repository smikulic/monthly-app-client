import React, { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { toast } from "react-toastify";
import { SelectChangeEvent } from "@mui/material";
import { Subcategory, useCreateExpenseMutation } from "@/generated/graphql";
import { SelectStyled, TextFieldStyled } from "@/shared";
import { DatePickerStyled } from "@/components/ui/DatePickerStyled";
import { MenuItem } from "@/components/ui/MenuItem";
import { SubcategoryDecoratedWithExpenses } from "../expenses-list/expenses-list";
import { FormDialog } from "../form-dialog/form-dialog";

interface Props {
  open: boolean;
  subcategories: SubcategoryDecoratedWithExpenses[];
  currentDate: Date;
  closeForm: () => void;
}

export const CreateExpenseForm: React.FC<Props> = ({
  open,
  subcategories,
  currentDate,
  closeForm,
}) => {
  const client = useApolloClient();

  const [formInvalid, setFormInvalid] = useState(true);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(currentDate);
  const [expenseSubcategoryId, setExpenseSubcategoryId] = useState("");

  const [createExpense] = useCreateExpenseMutation({
    onCompleted: ({ createExpense }) => {
      closeForm();
      setExpenseAmount("");
      setExpenseDate(currentDate);
      setExpenseSubcategoryId("");

      // Clear chartExpenses cache so that we don't have to refetch everytime on state change,
      // but only when expense data changes
      client.cache.evict({ id: "ROOT_QUERY", fieldName: "chartExpenses" });
      client.cache.gc();

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
      open={open}
      title="Expense"
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
      <TextFieldStyled
        required
        id="amount"
        label="Amount"
        size="small"
        margin="none"
        autoComplete="off"
        onChange={(e) => setExpenseAmount(e.target.value)}
      />
      <DatePickerStyled
        label="Date"
        value={expenseDate}
        onChange={(newValue: any) =>
          newValue ? setExpenseDate(newValue) : null
        }
      />

      <SelectStyled
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
      </SelectStyled>
    </FormDialog>
  );
};
