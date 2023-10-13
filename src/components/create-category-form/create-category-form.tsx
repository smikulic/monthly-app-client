import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { useCreateCategoryMutation } from "../../generated/graphql";
import { FormDialog } from "../form-dialog/form-dialog";
import Alert from "@mui/material/Alert";

interface Props {
  open: boolean;
  closeForm: () => void;
  refetch: () => Promise<unknown>;
}

export const CreateCategoryForm: React.FC<Props> = ({
  open,
  closeForm,
  refetch,
}) => {
  const [formInvalid, setFormInvalid] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  const [createCategory] = useCreateCategoryMutation({
    onCompleted: ({ createCategory }) => {
      refetch();
      closeForm();
      setCategoryName("");
      toast.success(
        `You have successfully created ${createCategory.name} category!`
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
      title="Category"
      disabled={formInvalid}
      formActionText="Create"
      closeForm={closeForm}
      formAction={() =>
        createCategory({
          variables: {
            name: categoryName,
          },
        })
      }
    >
      <TextField
        required
        id="categoryName"
        label="Name"
        size="small"
        margin="none"
        autoComplete="off"
        onChange={(e) => setCategoryName(e.target.value)}
      />

      <Alert severity="info">
        <strong>Tip:</strong> Good categories can be very abstract, such as
        "Food", "Entertainment", "Home", "Transport", etc.
      </Alert>
    </FormDialog>
  );
};
