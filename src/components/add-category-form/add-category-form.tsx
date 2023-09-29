import React, { useState } from "react";
import { useCreateCategoryMutation } from "../../generated/graphql";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

interface Props {
  refetchCategories: () => Promise<unknown>;
  closeForm: () => void;
}

export const AddCategoryForm: React.FC<Props> = ({
  refetchCategories,
  closeForm,
}) => {
  const [newCategoryName, setCategoryName] = useState("");

  const [createCategory, { loading: loadingCreateCategory }] =
    useCreateCategoryMutation({
      variables: {
        name: newCategoryName,
      },
      onCompleted: ({ createCategory }) => {
        refetchCategories();
        closeForm();
        setCategoryName("");
        toast.success(
          `You have successfully created ${createCategory.name} category!`
        );
      },
    });

  return (
    <div className="listItem category addField">
      <input
        type="text"
        placeholder="Category name"
        onChange={(e) => setCategoryName(e.target.value)}
      />
      <div className="buttonsGroup">
        <button className="btn btnCancel red" onClick={closeForm}>
          Cancel
        </button>
        <button className="btn" onClick={() => createCategory()}>
          {loadingCreateCategory ? "saving..." : "Add"}
        </button>
      </div>
    </div>
  );
};
