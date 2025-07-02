import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FormControl, SelectChangeEvent } from "@mui/material";
import {
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  Subcategory,
  Category,
} from "@/generated/graphql";
import { SelectStyled, TextFieldStyled } from "@/shared";
import { DatePickerStyled } from "@/components/ui/DatePickerStyled";
import { MenuItem } from "@/components/ui/MenuItem";
import { FormDialog } from "../form-dialog/form-dialog";

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
        <SelectStyled
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
        </SelectStyled>
      )}
      <FormControl size="small" margin="dense">
        <TextFieldStyled
          required
          id="subcategoryName"
          label="Name"
          size="small"
          margin="none"
          autoComplete="off"
          value={subcategoryName}
          onChange={(e) => setSubcategoryName(e.target.value)}
        />
      </FormControl>
      <TextFieldStyled
        required
        id="subcategoryBudget"
        label="Budget"
        size="small"
        margin="none"
        autoComplete="off"
        value={subcategoryBudget}
        onChange={(e) => setSubcategoryBudget(Number(e.target.value))}
      />

      <DatePickerStyled
        label="Rollover Date"
        value={subcategoryRolloverDate}
        onChange={(date: any) => date && setSubcategoryRolloverDate(date)}
      />
    </FormDialog>
  );
};
