import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import {
  Category,
  useCreateSubcategoryMutation,
} from "../../generated/graphql";
import { FormDialog } from "../form-dialog/form-dialog";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface Props {
  open: boolean;
  categories: Category[];
  closeForm: () => void;
  refetch: () => Promise<unknown>;
}

export const CreateSubcategoryForm: React.FC<Props> = ({
  open,
  categories,
  closeForm,
  refetch,
}) => {
  const [formInvalid, setFormInvalid] = useState(true);
  const [subcategoryBudget, setSubcategoryBudget] = useState(0);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [createSubcategory] = useCreateSubcategoryMutation({
    onCompleted: ({ createSubcategory }) => {
      refetch();
      closeForm();
      setSubcategoryName("");
      setSubcategoryBudget(0);
      setCategoryId("");
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

      <Alert severity="info">
        <strong>Example:</strong> "Transport" category can have "Bike", "Car",
        "Uber" subcategories.
      </Alert>
      <Alert severity="info">
        <strong>Subcategory budget: </strong> is used to calculate rollover.
        <br />
        A rollover budget is when the subcategory budget rollover into the next
        month. This means you could start the month in the negative if you have
        overspent, or start with the positive if you underspent. This allows you
        to plan ahead for expenses and savings.
        <br />
        <strong>
          It starts from the month of subcategory creation - and changing it
          changes the rollover too!
        </strong>
      </Alert>
    </FormDialog>
  );
};
