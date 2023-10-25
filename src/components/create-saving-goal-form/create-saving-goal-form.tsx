import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useCreateSavingGoalMutation } from "../../generated/graphql";
import { FormDialog } from "../form-dialog/form-dialog";
import Alert from "@mui/material/Alert";

interface Props {
  open: boolean;
  closeForm: () => void;
  refetch: () => Promise<unknown>;
}

export const CreateSavingGoalForm: React.FC<Props> = ({
  open,
  closeForm,
  refetch,
}) => {
  const [formInvalid, setFormInvalid] = useState(true);
  const [savingGoalName, setSavingGoalName] = useState("");
  const [savingGoalAmount, setSavingGoalAmount] = useState("");
  const [savingGoalInitialAmount, setSavingGoalInitialAmount] = useState("");
  const [savingGoalDate, setSavingGoalDate] = useState(new Date());

  const [createSavingGoal] = useCreateSavingGoalMutation({
    onCompleted: ({ createSavingGoal }) => {
      refetch();
      closeForm();
      toast.success(
        `You have successfully created ${createSavingGoal.name} saving goal!`
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
      formActionText="Create"
      closeForm={closeForm}
      formAction={() =>
        createSavingGoal({
          variables: {
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
        onChange={(e) => setSavingGoalName(e.target.value)}
      />
      <TextField
        required
        id="savingGoalAmount"
        label="Goal amount"
        size="small"
        margin="none"
        autoComplete="off"
        onChange={(e) => setSavingGoalAmount(e.target.value)}
      />
      <TextField
        id="savingGoalInitialAmount"
        label="How much did you save so far?"
        size="small"
        margin="none"
        autoComplete="off"
        onChange={(e) => setSavingGoalInitialAmount(e.target.value)}
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

      <Alert severity="info">
        <strong>Example:</strong> A saving goals can be something like "Summer
        vacation", "New car", "IKEA chair", etc.
      </Alert>
      <Alert severity="info">
        <strong>Goal amount:</strong> How much do you estimate you goal would
        cost.
        <br />
        <strong>Goal date:</strong> Date when you wish to purchase what you are
        saving for.
      </Alert>
    </FormDialog>
  );
};
