import React, { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { toast } from "react-toastify";
import { SelectChangeEvent } from "@mui/material";
import {
  Expense,
  Subcategory,
  useUpdateExpenseMutation,
} from "@/generated/graphql";
import { SelectStyled, TextFieldStyled } from "@/shared";
import { DatePickerStyled } from "@/components/ui/DatePickerStyled";
import { MenuItem } from "@/components/ui/MenuItem";
import { FormDialog } from "../form-dialog/form-dialog";
import { FORM_ACTIONS, TOAST_MESSAGES, ENTITY_NAMES } from "@/constants/forms";

interface Props {
  open: boolean;
  formData: Expense;
  subcategories: Subcategory[];
  closeForm: () => void;
}

export const UpdateExpenseForm: React.FC<Props> = ({
  open,
  formData,
  subcategories,
  closeForm,
}) => {
  const client = useApolloClient();

  const formExpenseDate = new Date(parseInt(formData.date, 10));

  const [formInvalid, setFormInvalid] = useState(true);
  const [expenseAmount, setExpenseAmount] = useState(formData.amount);
  const [expenseDescription, setExpenseDescription] = useState(
    formData.description
  );
  const [expenseDate, setExpenseDate] = useState(formExpenseDate);
  const [expenseSubcategoryId, setExpenseSubcategoryId] = useState(
    formData.subcategoryId
  );

  const [updateExpense] = useUpdateExpenseMutation({
    onCompleted: ({ updateExpense }) => {
      closeForm();
      setExpenseSubcategoryId("");
      setExpenseDate(new Date());
      setExpenseAmount(0);
      setExpenseDescription("");

      // Clear chartExpenses cache so that we don't have to refetch everytime on state change,
      // but only when expense data changes
      client.cache.evict({ id: "ROOT_QUERY", fieldName: "chartExpenses" });
      client.cache.gc();

      toast.success(TOAST_MESSAGES.SUCCESS.UPDATE(ENTITY_NAMES.EXPENSE));
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
      formActionText={FORM_ACTIONS.SAVE}
      closeForm={closeForm}
      formAction={() =>
        updateExpense({
          variables: {
            id: formData.id,
            amount: expenseAmount,
            description: expenseDescription,
            date: String(expenseDate),
            subcategoryId: expenseSubcategoryId,
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
        value={expenseAmount}
        onChange={(e) => setExpenseAmount(Number(e.target.value))}
      />
      <TextFieldStyled
        id="description"
        label="Description"
        size="small"
        margin="none"
        autoComplete="off"
        value={expenseDescription}
        onChange={(e) => setExpenseDescription(e.target.value)}
      />
      <DatePickerStyled
        label="Date"
        value={expenseDate}
        onChange={(newValue: Date | null) =>
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
