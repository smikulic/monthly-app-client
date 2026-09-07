import { useState } from "react";
import { useApolloClient } from "@apollo/client";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { invalidateBudgetFigures } from "@/utils/invalidateBudgetFigures";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  SubcategoryBudget,
  useDeleteSubcategoryBudgetMutation,
  useSetSubcategoryBudgetMutation,
} from "@/generated/graphql";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Stack } from "@/components/ui/Stack";
import { Typography } from "@/components/ui/Typography";
import { DatePickerStyled } from "@/components/ui/DatePickerStyled";
import { TextFieldStyled } from "@/shared";

// The API sends dates as millisecond timestamps in a string.
const toDate = (timestamp: string): Date => new Date(parseInt(timestamp, 10));
const monthLabel = (date: Date) => dayjs(date).format("MMM YYYY");
const apiMonth = (date: Date) => dayjs(date).format("YYYY-MM-DD");

interface Props {
  subcategoryId: string;
  periods: SubcategoryBudget[];
  onChanged: () => void;
}

/**
 * The subcategory's amount schedule.
 *
 * Shown as a list because there is genuinely more than one number: a budget
 * that changed in January still has to say what it was in December, and a
 * schedule you cannot see is one you cannot correct.
 *
 * There is no edit mode. `setSubcategoryBudget` upserts on the month, so
 * changing an existing period and adding a new one are the same call; clicking
 * a row just loads it into the form below. Rows save on their own rather than
 * with the surrounding dialog, since each is an independent mutation.
 */
export const BudgetScheduleEditor = ({
  subcategoryId,
  periods,
  onChanged,
}: Props) => {
  // The dialog opens with a snapshot of the subcategory, so the schedule is
  // tracked here and replaced from each mutation's own result.
  const [rows, setRows] = useState<SubcategoryBudget[]>(periods);
  const [amount, setAmount] = useState("");
  const [validFrom, setValidFrom] = useState<Date>(
    dayjs().startOf("month").toDate()
  );

  const sorted = [...rows].sort(
    (a, b) => toDate(a.validFrom).getTime() - toDate(b.validFrom).getTime()
  );
  const thisMonth = dayjs().startOf("month");
  const activeId = sorted
    .filter((row) => !dayjs(toDate(row.validFrom)).isAfter(thisMonth, "month"))
    .slice(-1)[0]?.id;

  const client = useApolloClient();

  const applied = () => {
    setAmount("");
    // A new period changes the figures for every month from it onwards, not
    // just the one the page happens to be showing.
    invalidateBudgetFigures(client);
    onChanged();
  };

  const [setBudget, { loading: saving }] = useSetSubcategoryBudgetMutation({
    onCompleted: ({ setSubcategoryBudget }) => {
      setRows(setSubcategoryBudget.budgets);
      applied();
    },
    onError: (error) => toast.error(error.message),
  });

  const [deleteBudget, { loading: deleting }] =
    useDeleteSubcategoryBudgetMutation({
      onCompleted: ({ deleteSubcategoryBudget }) => {
        setRows(deleteSubcategoryBudget.budgets);
        applied();
      },
      onError: (error) => toast.error(error.message),
    });

  const busy = saving || deleting;

  const save = () => {
    const value = Number(amount);
    if (!value || value < 0) {
      toast.error("Enter a budget amount above zero");
      return;
    }

    setBudget({
      variables: { subcategoryId, amount: value, validFrom: apiMonth(validFrom) },
    });
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
        Budget history
      </Typography>

      {sorted.map((row) => {
        const from = toDate(row.validFrom);

        return (
          <Stack
            key={row.id}
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ py: 0.5, cursor: "pointer" }}
            onClick={() => {
              setAmount(String(row.amount));
              setValidFrom(from);
            }}
          >
            <Typography variant="body2" sx={{ minWidth: 72 }}>
              {row.amount}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ flexGrow: 1 }}
            >
              from {monthLabel(from)}
              {row.id === activeId && " · now"}
            </Typography>
            <IconButton
              aria-label={`Remove budget from ${monthLabel(from)}`}
              // The last one cannot go: a subcategory with no period has no
              // budget in any month, and the form offers no way back.
              disabled={busy || sorted.length <= 1}
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                deleteBudget({
                  variables: { subcategoryId, validFrom: apiMonth(from) },
                });
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        );
      })}

      {/* An amount is a few digits and a month is a fixed "MMM YYYY", so both
          are sized to their content rather than sharing the row evenly. Left to
          flex, the amount field took the slack and clipped the month. Wraps on
          a narrow screen instead of squeezing. */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        useFlexGap
        flexWrap="wrap"
        sx={{ pt: 1.5 }}
      >
        <TextFieldStyled
          id="budget-period-amount"
          label="Budget"
          size="small"
          margin="none"
          autoComplete="off"
          value={amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAmount(e.target.value)
          }
          data-testid="budget-period-amount-input"
          sx={{ flex: "0 0 116px" }}
        />
        {/* Defaults to this month, so the ordinary change never reaches back
            and re-costs months already recorded. */}
        <DatePickerStyled
          label="From"
          views={["year", "month"]}
          format="MMM YYYY"
          value={validFrom}
          onChange={(date: Date | null) => date && setValidFrom(date)}
          sx={{ flex: "1 1 156px", minWidth: 156 }}
        />
        <Button
          size="small"
          disabled={busy || !amount}
          onClick={save}
          sx={{ flexShrink: 0 }}
        >
          Apply
        </Button>
      </Stack>
    </Box>
  );
};
