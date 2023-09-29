import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useCreateSubcategoryMutation } from "../../generated/graphql";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

interface Props {
  categoryId: string;
  refetchCategories: () => Promise<unknown>;
  closeForm: () => void;
}

export const CreateSubcategoryForm: React.FC<Props> = ({
  categoryId,
  refetchCategories,
  closeForm,
}) => {
  const [formInvalid, setFormInvalid] = useState(true);
  const [newSubcategoryBudgetAmount, setSubcategoryBudgetAmount] = useState(0);
  const [newSubcategoryName, setSubcategoryName] = useState("");

  const [createSubcategory, { loading }] = useCreateSubcategoryMutation({
    onCompleted: ({ createSubcategory }) => {
      refetchCategories();
      closeForm();
      setSubcategoryName("");
      toast.success(
        `You have successfully created ${createSubcategory.name} subcategory!`
      );
    },
  });

  useEffect(() => {
    if (!newSubcategoryName || !newSubcategoryBudgetAmount) {
      setFormInvalid(true);
    } else {
      setFormInvalid(false);
    }
  }, [newSubcategoryName, newSubcategoryBudgetAmount]);

  return (
    <>
      <TextField
        required
        id="subcategoryName"
        label="Subcategory name"
        size="small"
        margin="dense"
        onChange={(e) => setSubcategoryName(e.target.value)}
      />
      <TextField
        required
        id="subcategoryBudget"
        label="Subcategory budget"
        size="small"
        margin="dense"
        onChange={(e) => setSubcategoryBudgetAmount(Number(e.target.value))}
      />

      <br />
      <Stack spacing={1} direction="row">
        <Button variant="outlined" color="warning" onClick={closeForm}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={formInvalid}
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
          {loading ? "saving..." : "Create"}
        </Button>
      </Stack>
    </>
  );
};
