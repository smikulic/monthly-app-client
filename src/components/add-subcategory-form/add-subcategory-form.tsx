import React, { useState } from "react";
import { useCreateSubcategoryMutation } from "../../generated/graphql";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

interface Props {
  categoryId: string;
  refetchCategories: () => Promise<unknown>;
  closeForm: () => void;
}

export const AddSubcategoryForm: React.FC<Props> = ({
  categoryId,
  refetchCategories,
  closeForm,
}) => {
  const [newSubcategoryBudgetAmount, setSubcategoryBudgetAmount] = useState(0);
  const [newSubcategoryName, setSubcategoryName] = useState("");

  const [createSubcategory, { loading: loadingCreateSubcategory }] =
    useCreateSubcategoryMutation({
      onCompleted: ({ createSubcategory }) => {
        refetchCategories();
        closeForm();
        setSubcategoryName("");
        toast.success(
          `You have successfully created ${createSubcategory.name} subcategory!`
        );
      },
    });

  return (
    <div className="listItem subcategory addField">
      <input
        type="text"
        placeholder="Subcategory name"
        onChange={(e) => setSubcategoryName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subcategory budget"
        onChange={(e) => setSubcategoryBudgetAmount(Number(e.target.value))}
      />
      <div className="buttonsGroup">
        <button className="btn btnCancel red" onClick={closeForm}>
          Cancel
        </button>
        <button
          className="btn"
          onClick={() =>
            createSubcategory({
              variables: {
                categoryId,
                budgetAmount: newSubcategoryBudgetAmount,
                name: newSubcategoryName,
              },
            })
          }
        >
          {loadingCreateSubcategory ? "saving..." : "Add"}
        </button>
      </div>
    </div>
  );
};
