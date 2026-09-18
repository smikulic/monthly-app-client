import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useApolloClient } from "@apollo/client";
import {
  Expense,
  Subcategory,
  useUpdateExpenseMutation,
} from "@/generated/graphql";
import { SelectStyled, TextFieldStyled } from "@/shared";
import { FORM_ACTIONS, TOAST_MESSAGES, ENTITY_NAMES } from "@/constants/forms";
import { SelectChangeEvent } from "@/components/ui/Select";
import { DatePickerStyled } from "@/components/ui/DatePickerStyled";
import { FormDialog } from "@/components/form-dialog/form-dialog";
import { MenuItem } from "@/components/ui/MenuItem";
import { PaidBySelect } from "@/features/groups/paid-by-select";
import dayjs from "dayjs";

interface Props {
  open: boolean;
  formData: Expense;
  subcategories: Subcategory[];
  categoryGroupId?: string | null;
  closeForm: () => void;
}

export const UpdateExpenseForm: React.FC<Props> = ({
  open,
  formData,
  subcategories,
  categoryGroupId,
  closeForm,
}) => {
  const client = useApolloClient();

  const formExpenseDate = new Date(parseInt(formData.date, 10));

  const [formInvalid, setFormInvalid] = useState(true);
  // `number | ""` so the field can be cleared. `Number("")` is 0, which
  // meant emptying the box silently rewrote the amount as zero.
  const [expenseAmount, setExpenseAmount] = useState<number | "">(
    formData.amount,
  );
  // `description` is nullable, and an expense saved without one arrives as
  // null — which React rejects as the value of a controlled input. The create
  // form starts it at "" for the same reason.
  const [expenseDescription, setExpenseDescription] = useState(
    formData.description ?? "",
  );
  const [expenseDate, setExpenseDate] = useState(formExpenseDate);
  const [expenseSubcategoryId, setExpenseSubcategoryId] = useState(
    formData.subcategoryId,
  );
  const [paidByUserId, setPaidByUserId] = useState(formData.paidBy?.id ?? "");

  const [updateExpense] = useUpdateExpenseMutation({
    onCompleted: () => {
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
            amount: Number(expenseAmount),
            // Empty means "no description", so clear it rather than
            // storing an empty string.
            description: expenseDescription || null,
            date: dayjs(expenseDate).format("YYYY-MM-DD"),
            subcategoryId: expenseSubcategoryId,
            paidByUserId: categoryGroupId ? paidByUserId : undefined,
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
        onChange={(e) =>
          setExpenseAmount(e.target.value === "" ? "" : Number(e.target.value))
        }
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

      <PaidBySelect
        groupId={categoryGroupId}
        value={paidByUserId}
        onChange={setPaidByUserId}
      />
    </FormDialog>
  );
};
