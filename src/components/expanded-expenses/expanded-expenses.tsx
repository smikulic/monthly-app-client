import React from "react";
import { format } from "date-fns";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Expense, useDeleteExpenseMutation } from "../../generated/graphql";
import { AnchorActionDropdownElProps } from "../categories-list/categories-list";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

interface Props {
  expenses: Expense[];
  subcategoryName: string;
  refetchExpenses: () => Promise<unknown>;
}

export const ExpandedExpenses: React.FC<Props> = ({
  expenses,
  subcategoryName,
  refetchExpenses,
}) => {
  const [anchorActionDropdownEl, setAnchorActionDropdownEl] =
    React.useState<AnchorActionDropdownElProps>({});

  const [deleteExpense] = useDeleteExpenseMutation({
    onError: () => {
      toast.error(`Error while deleting an expense! Please try again.`);
    },
    onCompleted: ({ deleteExpense }) => {
      refetchExpenses();
      toast.success(
        `You have successfully removed ${deleteExpense.id} expense!`
      );
    },
  });

  const handleActionsDropdownClick = (
    event: React.MouseEvent<HTMLElement>,
    anchorIndex: string
  ) => {
    setAnchorActionDropdownEl({
      ...anchorActionDropdownEl,
      [anchorIndex]: event.currentTarget,
    });
  };

  const handleActionsDropdownClose = (anchorIndex: string) => {
    setAnchorActionDropdownEl({
      ...anchorActionDropdownEl,
      [anchorIndex]: null,
    });
  };

  return (
    <>
      {expenses.map((expense: Expense) => {
        if (!expense) return null;

        const expenseId = expense.id;
        const expenseISODate = Number(expense.date);

        return (
          <span key={expenseId}>
            <div className="listItem expense">
              <div className="expenseField expenseDate">
                {subcategoryName} - {format(expenseISODate, "dd MMM")} -{" "}
                {expense.amount} €
              </div>
              <div className="actions">
                <div>
                  <IconButton
                    id={`long-menu-icon-${expenseId}`}
                    aria-haspopup="true"
                    size="small"
                    onClick={(event) =>
                      handleActionsDropdownClick(event, expenseId)
                    }
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id={`long-menu-${expenseId}`}
                    anchorEl={anchorActionDropdownEl[expenseId]}
                    open={Boolean(anchorActionDropdownEl[expenseId])}
                    onClose={() => handleActionsDropdownClose(expenseId)}
                  >
                    <MenuItem
                      disabled
                      onClick={() => handleActionsDropdownClose(expenseId)}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        deleteExpense({ variables: { id: expenseId } });
                        handleActionsDropdownClose(expenseId);
                      }}
                    >
                      Remove
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
          </span>
        );
      })}
    </>
  );
};
