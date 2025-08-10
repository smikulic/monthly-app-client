import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Investment,
  useCreateInvestmentMutation,
  useUpdateInvestmentMutation,
} from "@/generated/graphql";
import {
  CURRENCY_OPTIONS,
  FORM_ACTIONS,
  TOAST_MESSAGES,
  ENTITY_NAMES,
} from "@/constants/forms";
import { analytics } from "@/utils/mixpanel";
import { TextFieldStyled } from "@/shared";
import { FormControl } from "@/components/ui/FormControl";
import { InputLabel } from "@/components/ui/InputLabel";
import { Select } from "@/components/ui/Select";
import { DatePickerStyled } from "@/components/ui/DatePickerStyled";
import { MenuItem } from "@/components/ui/MenuItem";
import { Alert } from "@/components/ui/Alert";
import { UserContext } from "@/App";
import { FormDialog } from "@/components/form-dialog/form-dialog";
import dayjs from "dayjs";

interface FormProps {
  open: boolean;
  closeForm: () => void;
  formData?: Investment; // Optional, only provided for the update form
}

const useInvestmentForm = (
  type: "create" | "update",
  closeForm: () => void,
  formData?: Investment
) => {
  const userCurrency = useContext(UserContext);

  const isCreateMode = type === "create";
  const [formInvalid, setFormInvalid] = useState(true);
  const [investmentName, setInvestmentName] = useState(formData?.name || "");
  const [quantity, setQuantity] = useState(formData?.quantity || "");
  const [amount, setAmount] = useState(formData?.amount || "");
  const [currency, setCurrency] = useState(formData?.currency || userCurrency);
  const [initialAmount, setInitialAmount] = useState(
    formData?.initialAmount || ""
  );
  const [startDate, setStartDate] = useState(
    formData?.startDate
      ? new Date(parseInt(formData.startDate, 10))
      : new Date()
  );

  const [createInvestment] = useCreateInvestmentMutation({
    onCompleted: ({ createInvestment }) => {
      analytics.trackInvestmentCreated(
        createInvestment.name,
        createInvestment.initialAmount,
        createInvestment.currency
      );
      closeForm();
      toast.success(
        TOAST_MESSAGES.SUCCESS.CREATE(
          ENTITY_NAMES.INVESTMENT,
          createInvestment.name
        )
      );
    },
  });

  const [updateInvestment] = useUpdateInvestmentMutation({
    onCompleted: ({ updateInvestment }) => {
      closeForm();
      toast.success(
        TOAST_MESSAGES.SUCCESS.UPDATE(
          ENTITY_NAMES.INVESTMENT,
          updateInvestment.name
        )
      );
    },
  });

  useEffect(() => {
    setFormInvalid(
      !investmentName || !quantity || !currency || !initialAmount || !startDate
    );
  }, [investmentName, quantity, currency, initialAmount, startDate]);

  const handleFormAction = () => {
    const input = {
      name: investmentName,
      quantity: Number(quantity),
      amount: amount ? Number(amount) : undefined,
      currency: currency,
      initialAmount: Number(initialAmount),
      startDate: dayjs(startDate).format("YYYY-MM-DD"),
    };

    if (isCreateMode) {
      createInvestment({
        variables: {
          input,
        },
      });
    } else {
      updateInvestment({
        variables: {
          input: {
            id: formData!.id,
            ...input,
          },
        },
      });
    }
  };

  return {
    formInvalid,
    investmentName,
    quantity,
    amount,
    currency,
    initialAmount,
    startDate,
    setInvestmentName,
    setQuantity,
    setAmount,
    setCurrency,
    setInitialAmount,
    setStartDate,
    handleFormAction,
    formActionText: isCreateMode ? FORM_ACTIONS.CREATE : FORM_ACTIONS.SAVE,
  };
};

export const InvestmentFormFactory = ({
  open,
  closeForm,
  formData,
}: FormProps) => {
  const type = formData ? "update" : "create";
  const {
    formInvalid,
    investmentName,
    quantity,
    amount,
    currency,
    initialAmount,
    startDate,
    setInvestmentName,
    setQuantity,
    setAmount,
    setCurrency,
    setInitialAmount,
    setStartDate,
    handleFormAction,
    formActionText,
  } = useInvestmentForm(type, closeForm, formData);

  return (
    <FormDialog
      open={open}
      title="Investment"
      disabled={formInvalid}
      formActionText={formActionText}
      closeForm={closeForm}
      formAction={() => handleFormAction()}
    >
      <TextFieldStyled
        required
        id="investmentName"
        label="Investment Asset Name"
        size="small"
        margin="none"
        autoComplete="off"
        value={investmentName}
        onChange={(e) => setInvestmentName(e.target.value)}
      />

      <TextFieldStyled
        required
        id="quantity"
        label="Quantity"
        size="small"
        margin="none"
        autoComplete="off"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <TextFieldStyled
        required
        id="amount"
        label="Current Amount"
        size="small"
        margin="none"
        autoComplete="off"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <TextFieldStyled
        required
        id="initialAmount"
        label="Initial Amount"
        size="small"
        margin="none"
        autoComplete="off"
        type="number"
        value={initialAmount}
        onChange={(e) => setInitialAmount(e.target.value)}
      />

      <FormControl size="small" required sx={{ minWidth: 120 }}>
        <InputLabel id="currency-label">Currency</InputLabel>
        <Select
          labelId="currency-label"
          id="currency"
          value={currency}
          label="Currency"
          onChange={(e) => setCurrency(e.target.value)}
        >
          {CURRENCY_OPTIONS.map((currency) => (
            <MenuItem key={currency.value} value={currency.value}>
              {currency.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DatePickerStyled
        label="Start Date"
        value={startDate}
        onChange={(newValue: Date | null) =>
          newValue ? setStartDate(newValue) : null
        }
      />

      {type === "create" && (
        <>
          <Alert severity="info">
            <strong>Example:</strong> Investments can be things like "Apple
            Stock", "Bitcoin", "S&P 500 ETF", "House", etc.
          </Alert>
          <Alert severity="info">
            <strong>Quantity:</strong> Number of shares, coins, or units you
            own.
            <br />
            <strong>Current Amount:</strong> Current market value.
            <br />
            <strong>Initial Amount:</strong> The amount you initially invested.
            <br />
            <strong>Start Date:</strong> When you first made this investment.
          </Alert>
        </>
      )}
    </FormDialog>
  );
};

export default InvestmentFormFactory;
