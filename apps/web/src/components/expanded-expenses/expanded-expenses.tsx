import { FC, MouseEvent, useContext } from "react";
import { toast } from "react-toastify";
import { useApolloClient } from "@apollo/client";
import dayjs from "dayjs";
import { Expense, useDeleteExpenseMutation } from "@/generated/graphql";
import { UserContext } from "@/App";
import { useActionDropdown } from "@/hooks/useActionDropdown";
import { formatAmount } from "@/utils/format";
import {
  ExpenseFieldStyled,
  ExpenseListItemStyled,
} from "./expanded-expenses-style";
import { IconMenu } from "../icon-menu/icon-menu";
import { TOAST_MESSAGES, ENTITY_NAMES } from "@/constants/forms";

interface Props {
  expenses: Expense[];
  setUpdateModalExpense: (expense: Expense) => void;
  refetchExpenses: () => Promise<unknown>;
}

export const ExpandedExpenses: FC<Props> = ({
  expenses,
  setUpdateModalExpense,
  refetchExpenses,
}) => {
  const userCurrency = useContext(UserContext);
  const client = useApolloClient();

  const {
    anchorActionDropdownEl,
    handleActionsDropdownClick,
    handleActionsDropdownClose,
  } = useActionDropdown();

  const [deleteExpense] = useDeleteExpenseMutation({
    onError: () => {
      toast.error(TOAST_MESSAGES.ERROR.DELETE(ENTITY_NAMES.EXPENSE));
    },
    onCompleted: ({ deleteExpense }) => {
      refetchExpenses();

      // Clear chartExpenses cache so that we don't have to refetch everytime on state change,
      // but only when expense data changes
      client.cache.evict({ id: "ROOT_QUERY", fieldName: "chartExpenses" });
      client.cache.gc();

      toast.success(TOAST_MESSAGES.SUCCESS.DELETE(ENTITY_NAMES.EXPENSE));
    },
  });

  return (
    <>
      {expenses.map((expense: Expense) => {
        if (!expense) return null;

        const expenseId = expense.id;
        const expenseDescription = expense.description;
        const expenseISODate = Number(expense.date);

        return (
          <span key={expenseId}>
            <ExpenseListItemStyled>
              <ExpenseFieldStyled>
                {dayjs(expenseISODate).format("D MMM")} -{" "}
                {formatAmount(expense.amount, userCurrency)}
                {expenseDescription && <> - {expenseDescription}</>}
              </ExpenseFieldStyled>
              <IconMenu
                itemId={expenseId}
                anchorActionDropdownEl={anchorActionDropdownEl}
                handleOnEdit={() => {
                  setUpdateModalExpense(expense);
                  handleActionsDropdownClose(expenseId);
                }}
                handleOnRemove={() => {
                  deleteExpense({ variables: { id: expenseId } });
                  handleActionsDropdownClose(expenseId);
                }}
                handleOnOpenMenu={(event: MouseEvent<HTMLElement>) =>
                  handleActionsDropdownClick(event, expenseId)
                }
                handleOnCloseMenu={() => handleActionsDropdownClose(expenseId)}
              />
            </ExpenseListItemStyled>
          </span>
        );
      })}
    </>
  );
};
