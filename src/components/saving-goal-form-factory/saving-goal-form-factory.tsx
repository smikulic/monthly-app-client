import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FormDialog } from "../form-dialog/form-dialog";
import {
  SavingGoal,
  useCreateSavingGoalMutation,
  useUpdateSavingGoalMutation,
} from "../../generated/graphql";
import { Alert } from "@mui/material";

interface FormProps {
  open: boolean;
  closeForm: () => void;
  formData?: SavingGoal; // Optional, only provided for the update form
}

const useSavingGoalForm = (
  type: "create" | "update",
  closeForm: () => void,
  formData?: SavingGoal
) => {
  const isCreateMode = type === "create";
  const [formInvalid, setFormInvalid] = useState(true);
  const [savingGoalName, setSavingGoalName] = useState(formData?.name || "");
  const [savingGoalAmount, setSavingGoalAmount] = useState(
    formData?.goalAmount || ""
  );
  const [savingGoalInitialAmount, setSavingGoalInitialAmount] = useState(
    formData?.initialSaveAmount || ""
  );
  const [savingGoalDate, setSavingGoalDate] = useState(
    formData?.goalDate ? new Date(parseInt(formData.goalDate, 10)) : new Date()
  );

  const [createSavingGoal] = useCreateSavingGoalMutation({
    onCompleted: ({ createSavingGoal }) => {
      closeForm();
      toast.success(
        `You have successfully created ${createSavingGoal.name} saving goal!`
      );
    },
  });

  const [updateSavingGoal] = useUpdateSavingGoalMutation({
    onCompleted: ({ updateSavingGoal }) => {
      closeForm();
      toast.success(
        `You have successfully updated ${updateSavingGoal.name} saving goal!`
      );
    },
  });

  useEffect(() => {
    setFormInvalid(!savingGoalName || !savingGoalAmount || !savingGoalDate);
  }, [savingGoalName, savingGoalAmount, savingGoalDate]);

  const handleFormAction = () => {
    if (isCreateMode) {
      createSavingGoal({
        variables: {
          name: savingGoalName,
          goalDate: String(savingGoalDate),
          goalAmount: Number(savingGoalAmount),
          initialSaveAmount: Number(savingGoalInitialAmount),
        },
      });
    } else {
      updateSavingGoal({
        variables: {
          id: formData!.id,
          name: savingGoalName,
          goalDate: String(savingGoalDate),
          goalAmount: Number(savingGoalAmount),
          initialSaveAmount: Number(savingGoalInitialAmount),
        },
      });
    }
  };

  return {
    formInvalid,
    savingGoalName,
    savingGoalDate,
    savingGoalAmount,
    savingGoalInitialAmount,
    setSavingGoalName,
    setSavingGoalAmount,
    setSavingGoalInitialAmount,
    setSavingGoalDate,
    handleFormAction,
    formActionText: isCreateMode ? "Create" : "Save",
  };
};

export const SavingGoalFormFactory = ({
  open,
  closeForm,
  formData,
}: FormProps) => {
  const type = formData ? "update" : "create";
  const {
    formInvalid,
    savingGoalName,
    savingGoalAmount,
    savingGoalDate,
    setSavingGoalName,
    setSavingGoalAmount,
    savingGoalInitialAmount,
    setSavingGoalInitialAmount,
    setSavingGoalDate,
    handleFormAction,
    formActionText,
  } = useSavingGoalForm(type, closeForm, formData);

  return (
    <FormDialog
      open={open}
      title="Saving Goal"
      disabled={formInvalid}
      formActionText={formActionText}
      closeForm={closeForm}
      formAction={() => handleFormAction()}
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
          label="Goal date"
          value={savingGoalDate}
          onChange={(newValue) =>
            newValue ? setSavingGoalDate(newValue) : null
          }
        />
      </LocalizationProvider>

      {type === "create" && (
        <>
          <Alert severity="info">
            <strong>Example:</strong> A saving goals can be something like
            "Summer vacation", "New car", "IKEA chair", etc.
          </Alert>
          <Alert severity="info">
            <strong>Goal amount:</strong> How much do you estimate you goal
            would cost.
            <br />
            <strong>Goal date:</strong> Date when you wish to purchase what you
            are saving for.
          </Alert>
        </>
      )}
    </FormDialog>
  );
};

export default SavingGoalFormFactory;
