import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useCreateSubcategoryMutation } from "../../generated/graphql";
import { FormDialog } from "../form-dialog/form-dialog";
import Alert from "@mui/material/Alert";

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
  const [subcategoryRolloverDate, setSubcategoryRolloverDate] = useState(
    new Date()
  );

  const [createSubcategory] = useCreateSubcategoryMutation({
    onCompleted: ({ createSubcategory }) => {
      refetch();
      closeForm();
      setSubcategoryBudget(0);
      setSubcategoryName("");
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
      title="Subcategory"
      disabled={formInvalid}
      formActionText="Create"
      closeForm={closeForm}
      formAction={() =>
        createSubcategory({
          variables: {
            categoryId,
            budgetAmount: subcategoryBudget,
            name: subcategoryName,
            rolloverDate: String(subcategoryRolloverDate),
          },
        })
      }
    >
      <TextField
        required
        id="subcategoryName"
        label="Name"
        size="small"
        margin="none"
        autoComplete="off"
        onChange={(e) => setSubcategoryName(e.target.value)}
      />
      <TextField
        required
        id="subcategoryBudget"
        label="Budget"
        size="small"
        margin="none"
        autoComplete="off"
        onChange={(e) => setSubcategoryBudget(Number(e.target.value))}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Rollover Date"
          value={subcategoryRolloverDate}
          onChange={(newValue) =>
            newValue ? setSubcategoryRolloverDate(newValue) : null
          }
        />
      </LocalizationProvider>

      <Alert severity="info">
        <strong>Example:</strong> "Transport" category can have "Bike", "Car",
        "Uber" subcategories.
      </Alert>
      <Alert severity="info">
        <strong>Budget: </strong> is used to calculate rollover and changing it
        changes the rollover value as well!
        <br />
        <strong>Rollover</strong> is when the subcategory budget accumulates
        into the next month.
        <br />
        This means you could start the month in the negative if you have
        overspent, or start with the positive if you underspent. This allows you
        to plan ahead for expenses and savings.
        <br />
      </Alert>
    </FormDialog>
  );
};
