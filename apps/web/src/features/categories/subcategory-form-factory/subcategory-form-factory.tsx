import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  Subcategory,
  Category,
} from "@/generated/graphql";
import { FORM_ACTIONS, TOAST_MESSAGES, ENTITY_NAMES } from "@/constants/forms";
import { analytics } from "@/utils/mixpanel";
import { SelectStyled, TextFieldStyled } from "@/shared";
import { SelectChangeEvent } from "@/components/ui/Select";
import { FormControl } from "@/components/ui/FormControl";
import { DatePickerStyled } from "@/components/ui/DatePickerStyled";
import { MenuItem } from "@/components/ui/MenuItem";
import { FormDialog } from "@/components/form-dialog/form-dialog";
import dayjs from "dayjs";

const useSubcategoryForm = (
  type: "create" | "update",
  presetCategoryId: string,
  categories: Category[],
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
    formData?.budgetAmount
  );
  const [subcategoryRolloverDate, setSubcategoryRolloverDate] = useState(
    formData ? new Date(parseInt(formData.rolloverDate, 10)) : new Date()
  );

  const [createSubcategory] = useCreateSubcategoryMutation({
    onCompleted: ({ createSubcategory }) => {
      // Find the selected category to get category name
      const selectedCategory = categories.find((cat) => cat.id === categoryId);

      // Track subcategory creation
      analytics.trackSubcategoryCreated(
        createSubcategory.name,
        selectedCategory?.name || "Unknown",
        createSubcategory?.budgetAmount || 0
      );

      closeForm();
      toast.success(
        TOAST_MESSAGES.SUCCESS.CREATE(
          ENTITY_NAMES.SUBCATEGORY,
          createSubcategory.name
        )
      );
    },
    onError: (error) => {
      // Check for specific validation errors
      if (error.message.includes("budgetAmount must be positive")) {
        toast.error(TOAST_MESSAGES.ERROR.POSITIVE_AMOUNT);
      } else {
        toast.error(TOAST_MESSAGES.ERROR.CREATE(ENTITY_NAMES.SUBCATEGORY));
      }
    },
  });

  const [updateSubcategory] = useUpdateSubcategoryMutation({
    onCompleted: ({ updateSubcategory }) => {
      closeForm();
      toast.success(
        TOAST_MESSAGES.SUCCESS.UPDATE(
          ENTITY_NAMES.SUBCATEGORY,
          updateSubcategory.name
        )
      );
    },
    onError: (error) => {
      // Check for specific validation errors
      if (error.message.includes("budgetAmount must be positive")) {
        toast.error(TOAST_MESSAGES.ERROR.POSITIVE_AMOUNT);
      } else if (
        error.message.includes("A subcategory with this name already exists")
      ) {
        toast.error(
          TOAST_MESSAGES.ERROR.DUPLICATE_NAME(ENTITY_NAMES.SUBCATEGORY)
        );
      } else {
        toast.error(TOAST_MESSAGES.ERROR.UPDATE(ENTITY_NAMES.SUBCATEGORY));
      }
    },
  });

  useEffect(() => {
    setFormInvalid(!subcategoryName || !subcategoryBudget);
  }, [subcategoryName, subcategoryBudget]);

  const handleFormAction = () => {
    const variables = {
      categoryId,
      name: subcategoryName,
      budgetAmount: subcategoryBudget as number,
      rolloverDate: dayjs(subcategoryRolloverDate).format("YYYY-MM-DD"),
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
    formActionText: isCreateMode ? FORM_ACTIONS.CREATE : FORM_ACTIONS.SAVE,
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
  } = useSubcategoryForm(
    type,
    presetCategoryId,
    categories,
    closeForm,
    formData
  );

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
          data-testid="subcategory-name-input"
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
        data-testid="subcategory-budget-input"
      />

      <DatePickerStyled
        label="Rollover Date"
        value={subcategoryRolloverDate}
        onChange={(date: Date | null) =>
          date && setSubcategoryRolloverDate(date)
        }
      />
    </FormDialog>
  );
};
