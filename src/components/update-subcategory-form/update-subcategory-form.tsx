import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import {
  Category,
  Subcategory,
  useUpdateSubcategoryMutation,
} from "../../generated/graphql";
import { FormDialog } from "../form-dialog/form-dialog";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface Props {
  open: boolean;
  formData: Subcategory;
  categories: Category[];
  closeForm: () => void;
  refetch: () => Promise<unknown>;
}

export const UpdateSubcategoryForm: React.FC<Props> = ({
  open,
  formData,
  categories,
  closeForm,
  refetch,
}) => {
  const [formInvalid, setFormInvalid] = useState(true);
  const [subcategoryName, setSubcategoryName] = useState(formData.name);
  const [subcategoryBudget, setSubcategoryBudget] = useState(
    formData.budgetAmount
  );
  const [categoryId, setCategoryId] = useState(formData.categoryId);

  const [updateSubcategory] = useUpdateSubcategoryMutation({
    onCompleted: ({ updateSubcategory }) => {
      refetch();
      closeForm();
      setSubcategoryName("");
      setSubcategoryBudget(0);
      setCategoryId("");
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
      open={open}
      title="Update subcategory"
      disabled={formInvalid}
      formActionText="Save"
      closeForm={closeForm}
      formAction={() =>
        updateSubcategory({
          variables: {
            id: formData.id,
            categoryId,
            name: subcategoryName,
            budgetAmount: Number(subcategoryBudget),
          },
        })
      }
    >
      <FormControl size="small" margin="dense">
        <InputLabel>Category</InputLabel>
        <Select
          required
          id="category"
          label="Category"
          margin="none"
          value={categoryId}
          onChange={(e: SelectChangeEvent) => {
            setCategoryId(e.target.value);
          }}
        >
          {categories.map((category: Category) => {
            const categoryId = category.id;
            return (
              <MenuItem key={categoryId} value={categoryId}>
                {category.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
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

      <Alert severity="warning">
        <strong>Subcategory budget: </strong> is used to calculate rollover.
        <br />
        It starts from the month of subcategory creation - and changing it
        changes the rollover too!
      </Alert>
    </FormDialog>
  );
};
