import React, { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { toast } from "react-toastify";
import {
  Subcategory,
  useCreateExpenseMutation,
  useMeIdQuery,
} from "@/generated/graphql";
import { FORM_ACTIONS, TOAST_MESSAGES, ENTITY_NAMES } from "@/constants/forms";
import { analytics } from "@/utils/analytics";
import { FormRowStyled, SelectStyled, TextFieldStyled } from "@/shared";
import { SelectChangeEvent } from "@/components/ui/Select";
import { FormDialog } from "@/components/form-dialog/form-dialog";
import { DatePickerStyled } from "@/components/ui/DatePickerStyled";
import { MenuItem } from "@/components/ui/MenuItem";
import { PaidBySelect } from "@/features/groups/paid-by-select";
import { SubcategoryDecoratedWithExpenses } from "../expenses-list/expenses-list";
import dayjs from "dayjs";

interface Props {
  open: boolean;
  subcategories: SubcategoryDecoratedWithExpenses[];
  categoryGroupId?: string | null;
  currentDate: Date;
  closeForm: () => void;
}

export const CreateExpenseForm: React.FC<Props> = ({
  open,
  subcategories,
  categoryGroupId,
  currentDate,
  closeForm,
}) => {
  const client = useApolloClient();
  const { data: meData } = useMeIdQuery({ fetchPolicy: "cache-first" });
  const myId = meData?.me?.id;

  const [formInvalid, setFormInvalid] = useState(true);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState(currentDate);
  const [expenseSubcategoryId, setExpenseSubcategoryId] = useState(
    subcategories[0].id,
  );
  const [paidByUserId, setPaidByUserId] = useState("");

  // Default the payer to the current user once known.
  useEffect(() => {
    if (myId && !paidByUserId) setPaidByUserId(myId);
  }, [myId, paidByUserId]);

  const [createExpense] = useCreateExpenseMutation({
    onCompleted: ({ createExpense }) => {
      // Find the selected subcategory to get category and subcategory names
      const selectedSubcategory = subcategories.find(
        (sub) => sub.id === expenseSubcategoryId,
      );

      // Track expense creation
      analytics.trackExpenseCreated(
        Number(expenseAmount),
        selectedSubcategory?.categoryId || "Unknown",
        selectedSubcategory?.name || "Unknown",
      );

      /*
       * The one event that proves a household is real rather than merely set
       * up: an expense in a shared category that somebody else paid for.
       *
       * Everything earlier in the funnel is one person's intent — they made a
       * group, they sent an invite, the other person clicked a link. This is
       * the first time the second person's money is in the budget, and it is
       * the step worth optimising against.
       */
      if (categoryGroupId && paidByUserId && paidByUserId !== myId) {
        analytics.trackPartnerExpenseCreated();
      }

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
            date: dayjs(expenseDate).format("YYYY-MM-DD"),
            paidByUserId: categoryGroupId ? paidByUserId : undefined,
          },
        })
      }
    >
      {/*
        Every field here is controlled. Left uncontrolled they keep whatever
        the browser has in them while state says something else — and the
        validity check reads the state, not the field, so any path that resets
        one without recreating the input (`onCompleted` clears them) leaves a
        form that looks complete with Create greyed out.

        Paired because the date is almost always today and needs correcting
        perhaps once a week. It has no business taking a full row above the
        things you actually type.
      */}
      <FormRowStyled>
        <TextFieldStyled
          required
          autoFocus
          id="amount"
          label="Amount"
          size="small"
          margin="none"
          autoComplete="off"
          /*
           * `inputMode="decimal"` is the difference between a numeric keypad
           * and the full QWERTY keyboard with a manual switch to the numbers
           * pane, every time, for the one field that is always a number.
           *
           * It goes through `slotProps.htmlInput` because TextField forwards
           * unrecognised props to its root FormControl — as a bare prop it
           * landed on a div and the keypad never appeared. A test caught it.
           *
           * Not `type="number"`: that brings a spinner nobody wants, and
           * Safari discards input it dislikes rather than letting the field
           * hold a partial value like "12.".
           */
          slotProps={{
            htmlInput: { inputMode: "decimal", enterKeyHint: "next" },
          }}
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          data-testid="expense-amount-input"
        />

        <DatePickerStyled
          label="Date"
          value={expenseDate}
          onChange={(newValue: Date | null) =>
            newValue ? setExpenseDate(newValue) : null
          }
        />
      </FormRowStyled>
      <TextFieldStyled
        id="description"
        label="Description"
        size="small"
        margin="none"
        autoComplete="off"
        // The keyboard's action key says "Done" and submits, so a one-line
        // expense never needs anyone to reach past the keyboard for a button.
        slotProps={{ htmlInput: { enterKeyHint: "done" } }}
        value={expenseDescription}
        onChange={(e) => setExpenseDescription(e.target.value)}
        data-testid="expense-description-input"
      />
      {/* What it was and who paid, side by side — both are short values, both
          are chosen on nearly every expense, and together they read as one
          question rather than two rows of form. */}
      <FormRowStyled>
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

        <PaidBySelect
          groupId={categoryGroupId}
          value={paidByUserId}
          onChange={setPaidByUserId}
        />
      </FormRowStyled>

    </FormDialog>
  );
};
