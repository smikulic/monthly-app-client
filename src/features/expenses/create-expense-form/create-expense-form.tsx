import React, { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { toast } from "react-toastify";
import { Subcategory, useCreateExpenseMutation } from "@/generated/graphql";
import { FORM_ACTIONS, TOAST_MESSAGES, ENTITY_NAMES } from "@/constants/forms";
import { analytics } from "@/utils/mixpanel";
import { SelectStyled, TextFieldStyled } from "@/shared";
import { SelectChangeEvent } from "@/components/ui/Select";
import { FormDialog } from "@/components/form-dialog/form-dialog";
import { DatePickerStyled } from "@/components/ui/DatePickerStyled";
import { MenuItem } from "@/components/ui/MenuItem";
import { SubcategoryDecoratedWithExpenses } from "../expenses-list/expenses-list";

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
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState(currentDate);
  const [expenseSubcategoryId, setExpenseSubcategoryId] = useState(
    subcategories[0].id
  );

  const [createExpense] = useCreateExpenseMutation({
    onCompleted: ({ createExpense }) => {
      // Find the selected subcategory to get category and subcategory names
      const selectedSubcategory = subcategories.find(
        (sub) => sub.id === expenseSubcategoryId
      );

      // Track expense creation
      analytics.trackExpenseCreated(
        Number(expenseAmount),
        selectedSubcategory?.categoryId || "Unknown",
        selectedSubcategory?.name || "Unknown"
      );

      closeForm();
      setExpenseAmount("");
      setExpenseDescription("");
      setExpenseDate(currentDate);
      setExpenseSubcategoryId("");

      // Clear chartExpenses cache so that we don't have to refetch everytime on state change,
      // but only when expense data changes
      client.cache.evict({ id: "ROOT_QUERY", fieldName: "chartExpenses" });
      client.cache.gc();

      toast.success(TOAST_MESSAGES.SUCCESS.CREATE(ENTITY_NAMES.EXPENSE));
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
      formActionText={FORM_ACTIONS.CREATE}
      closeForm={closeForm}
      formAction={() =>
        createExpense({
          variables: {
            subcategoryId: expenseSubcategoryId,
            amount: Number(expenseAmount),
            description: expenseDescription,
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
        data-testid="expense-amount-input"
      />
      <TextFieldStyled
        id="description"
        label="Description"
        size="small"
        margin="none"
        autoComplete="off"
        onChange={(e) => setExpenseDescription(e.target.value)}
        data-testid="expense-description-input"
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
        data-testid="expense-subcategory-select"
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
