import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import {
  Subcategory,
  useUpdateSubcategoryMutation,
} from "../../generated/graphql";
import { FormDialog } from "../form-dialog/form-dialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

interface Props {
  formData: Subcategory;
  closeForm: () => void;
  refetch: () => Promise<unknown>;
}

export const UpdateSubcategoryForm: React.FC<Props> = ({
  formData,
  closeForm,
  refetch,
}) => {
  const [formInvalid, setFormInvalid] = useState(true);
  const [subcategoryName, setSubcategoryName] = useState(formData.name);
  const [subcategoryBudget, setSubcategoryBudget] = useState(
    formData.budgetAmount
  );

  const [updateSubcategory] = useUpdateSubcategoryMutation({
    onCompleted: ({ updateSubcategory }) => {
      refetch();
      closeForm();
      setSubcategoryName("");
      setSubcategoryBudget(0);
      toast.success(
        `You have successfully updated ${updateSubcategory.name} subcategory!`
      );
    },
  });

  useEffect(() => {
    if (!subcategoryName || !subcategoryBudget) {
      setFormInvalid(true);
    } else {
      setFormInvalid(false);
    }
  }, [subcategoryName, subcategoryBudget]);

  return (
    <FormDialog
      title="Update subcategory"
      disabled={formInvalid}
      formActionText="Save"
      closeForm={closeForm}
      formAction={() =>
        updateSubcategory({
          variables: {
            id: formData.id,
            name: subcategoryName,
            budgetAmount: Number(subcategoryBudget),
          },
        })
      }
    >
      <TextField
        required
        id="subcategoryName"
        label="Subcategory name"
        size="small"
        margin="none"
        autoComplete="off"
        value={subcategoryName}
        onChange={(e) => setSubcategoryName(e.target.value)}
      />
      <TextField
        required
        id="subcategoryBudget"
        label="Subcategory budget"
        size="small"
        margin="none"
        autoComplete="off"
        value={subcategoryBudget}
        onChange={(e) => setSubcategoryBudget(Number(e.target.value))}
      />
    </FormDialog>
  );
};
