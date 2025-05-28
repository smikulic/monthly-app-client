import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Alert from "@mui/material/Alert";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  Category,
} from "../../generated/graphql";
import { FormDialog } from "../form-dialog/form-dialog";
import { TextFieldStyled } from "@/shared";

interface FormProps {
  open: boolean;
  closeForm: () => void;
  formData?: Category; // Optional, only provided for the update form
}

const useCategoryForm = (
  type: "create" | "update",
  closeForm: () => void,
  formData?: Category
) => {
  const isCreateMode = type === "create";
  const [formInvalid, setFormInvalid] = useState(true);
  const [categoryName, setCategoryName] = useState(formData?.name || "");

  const [createCategory] = useCreateCategoryMutation({
    onCompleted: ({ createCategory }) => {
      closeForm();
      toast.success(
        `You have successfully created ${createCategory.name} category!`
      );
    },
  });

  const [updateCategory] = useUpdateCategoryMutation({
    onCompleted: ({ updateCategory }) => {
      closeForm();
      toast.success(
        `You have successfully updated ${updateCategory.name} category!`
      );
    },
  });

  useEffect(() => {
    setFormInvalid(!categoryName);
  }, [categoryName]);

  const handleFormAction = () => {
    if (isCreateMode) {
      createCategory({ variables: { name: categoryName } });
    } else {
      updateCategory({ variables: { id: formData!.id, name: categoryName } });
    }
  };

  return {
    formInvalid,
    categoryName,
    setCategoryName,
    handleFormAction,
    formActionText: isCreateMode ? "Create" : "Save",
  };
};

export const CategoryFormFactory = ({
  open,
  closeForm,
  formData,
}: FormProps) => {
  const type = formData ? "update" : "create";
  const {
    formInvalid,
    categoryName,
    setCategoryName,
    handleFormAction,
    formActionText,
  } = useCategoryForm(type, closeForm, formData);

  return (
    <FormDialog
      open={open}
      title="Category"
      disabled={formInvalid}
      formActionText={formActionText}
      closeForm={closeForm}
      formAction={() => handleFormAction()}
    >
      <TextFieldStyled
        required
        id="categoryName"
        label="Name"
        size="small"
        margin="none"
        autoComplete="off"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      />

      {type === "create" && (
        <Alert severity="info">
          <strong>Tip:</strong> Good categories can be very abstract, such as
          "Food", "Entertainment", "Home", "Transport", etc.
        </Alert>
      )}
    </FormDialog>
  );
};
