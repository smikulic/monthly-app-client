import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  SavingGoal,
  useCreateSavingGoalMutation,
  useUpdateSavingGoalMutation,
} from "@/generated/graphql";
import { FORM_ACTIONS, TOAST_MESSAGES, ENTITY_NAMES } from "@/constants/forms";
import { analytics } from "@/utils/mixpanel";
import { TextFieldStyled } from "@/shared";
import { DatePickerStyled } from "@/components/ui/DatePickerStyled";
import { FormDialog } from "@/components/form-dialog/form-dialog";
import { Alert } from "@/components/ui/Alert";
import dayjs from "dayjs";

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
      // Track saving goal creation
      analytics.trackSavingGoalCreated(
        createSavingGoal.name,
        createSavingGoal.goalAmount,
        createSavingGoal.goalDate
      );

      closeForm();
      toast.success(
        TOAST_MESSAGES.SUCCESS.CREATE(
          ENTITY_NAMES.SAVING_GOAL,
          createSavingGoal.name
        )
      );
    },
  });

  const [updateSavingGoal] = useUpdateSavingGoalMutation({
    onCompleted: ({ updateSavingGoal }) => {
      closeForm();
      toast.success(
        TOAST_MESSAGES.SUCCESS.UPDATE(
          ENTITY_NAMES.SAVING_GOAL,
          updateSavingGoal.name
        )
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
          goalDate: dayjs(savingGoalDate).format("YYYY-MM-DD"),
          goalAmount: Number(savingGoalAmount),
          initialSaveAmount: Number(savingGoalInitialAmount),
        },
      });
    } else {
      updateSavingGoal({
        variables: {
          id: formData!.id,
          name: savingGoalName,
          goalDate: dayjs(savingGoalDate).format("YYYY-MM-DD"),
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
    formActionText: isCreateMode ? FORM_ACTIONS.CREATE : FORM_ACTIONS.SAVE,
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
      <TextFieldStyled
        required
        id="savingGoalName"
        label="Name"
        size="small"
        margin="none"
        autoComplete="off"
        value={savingGoalName}
        onChange={(e) => setSavingGoalName(e.target.value)}
      />
      <TextFieldStyled
        required
        id="savingGoalAmount"
        label="How much do you estimate you goal costs?"
        size="small"
        margin="none"
        autoComplete="off"
        value={savingGoalAmount}
        onChange={(e) => setSavingGoalAmount(Number(e.target.value))}
      />
      <TextFieldStyled
        id="savingGoalInitialAmount"
        label="How much did you save so far?"
        size="small"
        margin="none"
        autoComplete="off"
        value={savingGoalInitialAmount}
        onChange={(e) => setSavingGoalInitialAmount(Number(e.target.value))}
      />
      <DatePickerStyled
        label="Goal date"
        value={savingGoalDate}
        onChange={(newValue: Date | null) =>
          newValue ? setSavingGoalDate(newValue) : null
        }
      />

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
