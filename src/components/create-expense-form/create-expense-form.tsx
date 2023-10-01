import React, { useState } from "react";
import { AddFormStyled } from "../../shared";
import { ListAddField } from "../list-add-field/list-add-field";
import { ExpenseFormFields } from "../expense-form-fields/expense-form-fields";
import { SubcategoryDecoratedWithExpenses } from "../expenses-list/expenses-list";

interface Props {
  subcategories: SubcategoryDecoratedWithExpenses[];
  currentDate: Date;
  refetchExpenses: () => Promise<unknown>;
}

export const CreateExpenseForm: React.FC<Props> = ({
  subcategories,
  currentDate,
  refetchExpenses,
}) => {
  const [formVisible, setFormVisible] = useState(false);

  return (
    <>
      {formVisible && (
        <AddFormStyled>
          <ExpenseFormFields
            subcategories={subcategories}
            currentDate={currentDate}
            refetchExpenses={refetchExpenses}
            closeForm={() => setFormVisible(false)}
          />
        </AddFormStyled>
      )}
      {!formVisible && (
        <ListAddField text="Add expense" onClick={() => setFormVisible(true)} />
      )}
    </>
  );
};
