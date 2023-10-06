import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { useCreateSubcategoryMutation } from "../../generated/graphql";
import { FormDialog } from "../form-dialog/form-dialog";

interface Props {
  open: boolean;
  categoryId: string;
  closeForm: () => void;
  refetch: () => Promise<unknown>;
}

export const CreateSubcategoryForm: React.FC<Props> = ({
  open,
  categoryId,
  closeForm,
  refetch,
}) => {
  const [formInvalid, setFormInvalid] = useState(true);
  const [subcategoryBudget, setSubcategoryBudget] = useState(0);
  const [subcategoryName, setSubcategoryName] = useState("");

  const [createSubcategory] = useCreateSubcategoryMutation({
    onCompleted: ({ createSubcategory }) => {
      refetch();
      closeForm();
      setSubcategoryName("");
      setSubcategoryBudget(0);
      toast.success(
        `You have successfully created ${createSubcategory.name} subcategory!`
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
      open={open}
      title="Create subcategory"
      disabled={formInvalid}
      formActionText="Create"
      closeForm={closeForm}
      formAction={() =>
        createSubcategory({
          variables: {
            categoryId,
            budgetAmount: subcategoryBudget,
            name: subcategoryName,
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
        onChange={(e) => setSubcategoryName(e.target.value)}
      />
      <TextField
        required
        id="subcategoryBudget"
        label="Subcategory budget"
        size="small"
        margin="none"
        autoComplete="off"
        onChange={(e) => setSubcategoryBudget(Number(e.target.value))}
      />
    </FormDialog>
  );
};
