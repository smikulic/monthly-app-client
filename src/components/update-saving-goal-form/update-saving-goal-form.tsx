import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import {
  SavingGoal,
  useUpdateSavingGoalMutation,
} from "../../generated/graphql";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FormDialog } from "../form-dialog/form-dialog";

interface Props {
  open: boolean;
  formData: SavingGoal;
  closeForm: () => void;
  refetch: () => Promise<unknown>;
}

export const UpdateSavingGoalForm: React.FC<Props> = ({
  open,
  formData,
  closeForm,
  refetch,
}) => {
  const formSavingGoalDate = new Date(parseInt(formData.goalDate, 10));

  const [formInvalid, setFormInvalid] = useState(true);
  const [savingGoalName, setSavingGoalName] = useState(formData.name);
  const [savingGoalAmount, setSavingGoalAmount] = useState(formData.goalAmount);
  const [savingGoalInitialAmount, setSavingGoalInitialAmount] = useState(
    formData.initialSaveAmount || 0
  );
  const [savingGoalDate, setSavingGoalDate] = useState(formSavingGoalDate);

  const [updateSavingGoal] = useUpdateSavingGoalMutation({
    onCompleted: ({ updateSavingGoal }) => {
      refetch();
      closeForm();
      toast.success(
        `You have successfully updated ${updateSavingGoal.name} saving goal!`
      );
    },
  });

  useEffect(() => {
    if (!savingGoalName || !savingGoalAmount || !savingGoalDate) {
      setFormInvalid(true);
    } else {
      setFormInvalid(false);
    }
  }, [savingGoalName, savingGoalAmount, savingGoalDate]);

  return (
    <FormDialog
      open={open}
      title="Saving Goal"
      disabled={formInvalid}
      formActionText="Save"
      closeForm={closeForm}
      formAction={() =>
        updateSavingGoal({
          variables: {
            id: formData.id,
            name: savingGoalName,
            goalDate: String(savingGoalDate),
            goalAmount: Number(savingGoalAmount),
            initialSaveAmount: Number(savingGoalInitialAmount),
          },
        })
      }
    >
      <TextField
        required
        id="savingGoalName"
        label="Name"
        size="small"
        margin="none"
        autoComplete="off"
        value={savingGoalName}
        onChange={(e) => setSavingGoalName(e.target.value)}
      />
      <TextField
        required
        id="savingGoalAmount"
        label="How much do you estimate you goal costs?"
        size="small"
        margin="none"
        autoComplete="off"
        value={savingGoalAmount}
        onChange={(e) => setSavingGoalAmount(Number(e.target.value))}
      />
      <TextField
        id="savingGoalInitialAmount"
        label="How much did you save so far?"
        size="small"
        margin="none"
        autoComplete="off"
        value={savingGoalInitialAmount}
        onChange={(e) => setSavingGoalInitialAmount(Number(e.target.value))}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="When do you wish to achieve your goal?"
          value={savingGoalDate}
          onChange={(newValue) =>
            newValue ? setSavingGoalDate(newValue) : null
          }
        />
      </LocalizationProvider>
    </FormDialog>
  );
};
