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

export const SubcategoryFormFields: React.FC<Props> = ({
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
      setSubcategoryBudgetAmount(0);
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
    <Stack spacing={1}>
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
        onChange={(e) => setSubcategoryBudgetAmount(Number(e.target.value))}
      />

      <Stack spacing={1} direction="row">
        <Button variant="outlined" color="warning" onClick={closeForm}>
          Cancel
        </Button>
        <Button
          fullWidth
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
    </Stack>
  );
};
