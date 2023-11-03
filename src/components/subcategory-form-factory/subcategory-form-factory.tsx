import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  Subcategory,
  Category,
} from "../../generated/graphql";
import { FormDialog } from "../form-dialog/form-dialog";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

const useSubcategoryForm = (
  type: "create" | "update",
  presetCategoryId: string,
  closeForm: () => void,
  formData?: Subcategory
) => {
  const isCreateMode = type === "create";
  const [formInvalid, setFormInvalid] = useState(true);
  const [categoryId, setCategoryId] = useState(
    formData?.categoryId || presetCategoryId
  );
  const [subcategoryName, setSubcategoryName] = useState(formData?.name || "");
  const [subcategoryBudget, setSubcategoryBudget] = useState(
    formData?.budgetAmount || 0
  );
  const [subcategoryRolloverDate, setSubcategoryRolloverDate] = useState(
    formData ? new Date(parseInt(formData.rolloverDate, 10)) : new Date()
  );

  const [createSubcategory] = useCreateSubcategoryMutation({
    onCompleted: ({ createSubcategory }) => {
      closeForm();
      toast.success(
        `You have successfully created ${createSubcategory.name} subcategory!`
      );
    },
  });

  const [updateSubcategory] = useUpdateSubcategoryMutation({
    onCompleted: ({ updateSubcategory }) => {
      closeForm();
      toast.success(
        `You have successfully updated ${updateSubcategory.name} subcategory!`
      );
    },
  });

  useEffect(() => {
    setFormInvalid(!subcategoryName || !subcategoryBudget);
  }, [subcategoryName, subcategoryBudget]);

  const handleFormAction = () => {
    const variables = {
      categoryId,
      name: subcategoryName,
      budgetAmount: subcategoryBudget,
      rolloverDate: subcategoryRolloverDate.toISOString(),
    };

    if (isCreateMode) {
      createSubcategory({ variables });
    } else {
      updateSubcategory({ variables: { ...variables, id: formData!.id } });
    }
  };

  return {
    formInvalid,
    categoryId,
    subcategoryName,
    subcategoryBudget,
    subcategoryRolloverDate,
    setCategoryId,
    setSubcategoryName,
    setSubcategoryBudget,
    setSubcategoryRolloverDate,
    handleFormAction,
    formActionText: isCreateMode ? "Create" : "Save",
  };
};

export const SubcategoryFormFactory = ({
  open,
  presetCategoryId,
  categories,
  closeForm,
  formData,
}: {
  open: boolean;
  presetCategoryId: string;
  categories: Category[];
  closeForm: () => void;
  formData?: Subcategory;
}) => {
  const type = formData ? "update" : "create";
  const {
    formInvalid,
    categoryId,
    subcategoryName,
    subcategoryBudget,
    subcategoryRolloverDate,
    setCategoryId,
    setSubcategoryName,
    setSubcategoryBudget,
    setSubcategoryRolloverDate,
    handleFormAction,
    formActionText,
  } = useSubcategoryForm(type, presetCategoryId, closeForm, formData);

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryId(event.target.value);
  };

  return (
    <FormDialog
      open={open}
      title="Subcategory"
      disabled={formInvalid}
      formActionText={formActionText}
      closeForm={closeForm}
      formAction={handleFormAction}
    >
      {type === "update" && (
        <FormControl size="small" margin="dense">
          <InputLabel>Category</InputLabel>
          <Select
            required
            id="category"
            data-testid="category"
            label="Category"
            margin="none"
            value={categoryId}
            onChange={handleCategoryChange}
          >
            {categories.map((category: Category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <TextField
        required
        id="subcategoryName"
        label="Name"
        size="small"
        margin="none"
        autoComplete="off"
        value={subcategoryName}
        onChange={(e) => setSubcategoryName(e.target.value)}
      />
      <TextField
        required
        id="subcategoryBudget"
        label="Budget"
        size="small"
        margin="none"
        autoComplete="off"
        value={subcategoryBudget}
        onChange={(e) => setSubcategoryBudget(Number(e.target.value))}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Rollover Date"
          value={subcategoryRolloverDate}
          onChange={(date) => date && setSubcategoryRolloverDate(date)}
        />
      </LocalizationProvider>
    </FormDialog>
  );
};
