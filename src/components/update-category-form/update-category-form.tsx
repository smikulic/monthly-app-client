import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { Category, useUpdateCategoryMutation } from "../../generated/graphql";
import { FormDialog } from "../form-dialog/form-dialog";

interface Props {
  open: boolean;
  formData: Category;
  closeForm: () => void;
  refetch: () => Promise<unknown>;
}

export const UpdateCategoryForm: React.FC<Props> = ({
  open,
  formData,
  closeForm,
  refetch,
}) => {
  const [formInvalid, setFormInvalid] = useState(true);
  const [categoryName, setCategoryName] = useState(formData.name);

  const [updateCategory] = useUpdateCategoryMutation({
    onCompleted: ({ updateCategory }) => {
      refetch();
      closeForm();
      setCategoryName("");
      toast.success(
        `You have successfully updated ${updateCategory.name} category!`
      );
    },
  });

  useEffect(() => {
    if (!categoryName) {
      setFormInvalid(true);
    } else {
      setFormInvalid(false);
    }
  }, [categoryName]);

  return (
    <FormDialog
      open={open}
      title="Update category"
      disabled={formInvalid}
      formActionText="Save"
      closeForm={closeForm}
      formAction={() =>
        updateCategory({
          variables: {
            id: formData.id,
            name: categoryName,
          },
        })
      }
    >
      <TextField
        required
        id="categoryName"
        label="Category name"
        size="small"
        margin="none"
        autoComplete="off"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      />
    </FormDialog>
  );
};
