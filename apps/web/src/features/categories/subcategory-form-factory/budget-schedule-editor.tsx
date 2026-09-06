import { useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
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

// The API sends dates as millisecond timestamps in a string, the same as
// rolloverDate and createdAt.
const toDate = (timestamp: string): Date => new Date(parseInt(timestamp, 10));

const monthLabel = (date: Date): string => dayjs(date).format("MMM YYYY");

const monthStart = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), 1);

/**
 * Which period applies today: the last one that has started. Expects the list
 * already sorted by start month.
 */
const currentPeriodId = (periods: SubcategoryBudget[]): string | undefined => {
  const thisMonth = monthStart(new Date());
  const started = periods.filter(
    (period) => monthStart(toDate(period.validFrom)) <= thisMonth
  );
  return started[started.length - 1]?.id;
};

interface DraftPeriod {
  /** Absent when adding rather than editing. */
  id?: string;
  amount: string;
  validFrom: Date;
}

interface Props {
  subcategoryId: string;
  periods: SubcategoryBudget[];
  onChanged: () => void;
}

/**
 * The subcategory's amount schedule.
 *
 * Shown as a list rather than a single figure because there is genuinely more
 * than one number: a budget that changed in January still has to say what it
 * was in December, and a schedule you cannot see is a schedule you cannot
 * correct.
 *
 * Rows save on their own rather than with the surrounding form. Each one is an
 * independent mutation, and batching them would mean inventing a shape for
 * "the whole schedule at once" that nothing else needs.
 */
export const BudgetScheduleEditor = ({
  subcategoryId,
  periods,
  onChanged,
}: Props) => {
  const [draft, setDraft] = useState<DraftPeriod | null>(null);
  // The dialog is opened with a snapshot of the subcategory, so the schedule is
  // tracked here and replaced from each mutation's own result. Refetching the
  // list behind would not reach that snapshot.
  const [rows, setRows] = useState<SubcategoryBudget[]>(periods);

  const sorted = [...rows].sort(
    (a, b) => toDate(a.validFrom).getTime() - toDate(b.validFrom).getTime()
  );
  const activeId = currentPeriodId(sorted);
  const isOnlyPeriod = sorted.length <= 1;

  const [setBudget, { loading: saving }] = useSetSubcategoryBudgetMutation({
    onCompleted: ({ setSubcategoryBudget }) => {
      setRows(setSubcategoryBudget.budgets);
      setDraft(null);
      onChanged();
    },
    onError: (error) => toast.error(error.message),
  });

  const [deleteBudget, { loading: deleting }] =
    useDeleteSubcategoryBudgetMutation({
      onCompleted: ({ deleteSubcategoryBudget }) => {
        setRows(deleteSubcategoryBudget.budgets);
        onChanged();
      },
      onError: (error) => toast.error(error.message),
    });

  const busy = saving || deleting;

  const commitDraft = () => {
    if (!draft) return;

    const amount = Number(draft.amount);
    if (!amount || amount < 0) {
      toast.error("Enter a budget amount above zero");
      return;
    }

    setBudget({
      variables: {
        subcategoryId,
        amount,
        validFrom: dayjs(draft.validFrom).format("YYYY-MM-DD"),
      },
    });
  };

  const removePeriod = (period: SubcategoryBudget) =>
    deleteBudget({
      variables: {
        subcategoryId,
        validFrom: dayjs(toDate(period.validFrom)).format("YYYY-MM-DD"),
      },
    });

  const renderDraft = () => (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 1 }}>
      <TextFieldStyled
        autoFocus
        id="budget-period-amount"
        label="Budget"
        size="small"
        margin="none"
        autoComplete="off"
        value={draft?.amount ?? ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setDraft((current) =>
            current ? { ...current, amount: e.target.value } : current
          )
        }
        data-testid="budget-period-amount-input"
      />
      <DatePickerStyled
        label="From"
        views={["year", "month"]}
        format="MMM YYYY"
        value={draft?.validFrom ?? null}
        onChange={(date: Date | null) =>
          date &&
          setDraft((current) =>
            current ? { ...current, validFrom: date } : current
          )
        }
      />
      <IconButton
        aria-label="Save budget period"
        disabled={busy}
        onClick={commitDraft}
      >
        <CheckIcon fontSize="small" />
      </IconButton>
      <IconButton aria-label="Cancel" onClick={() => setDraft(null)}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Stack>
  );

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
        Budget history
      </Typography>

      {sorted.map((period) =>
        draft?.id === period.id ? (
          <Box key={period.id}>{renderDraft()}</Box>
        ) : (
          <Stack
            key={period.id}
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ py: 0.5 }}
          >
            <Typography variant="body2" sx={{ minWidth: 72 }}>
              {period.amount}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ flexGrow: 1 }}
            >
              from {monthLabel(toDate(period.validFrom))}
              {period.id === activeId && " · now"}
            </Typography>
            <IconButton
              aria-label={`Edit budget from ${monthLabel(
                toDate(period.validFrom)
              )}`}
              disabled={busy}
              onClick={() =>
                setDraft({
                  id: period.id,
                  amount: String(period.amount),
                  validFrom: toDate(period.validFrom),
                })
              }
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label={`Remove budget from ${monthLabel(
                toDate(period.validFrom)
              )}`}
              // The last one cannot go: a subcategory with no period has no
              // budget in any month, and the form offers no way back.
              disabled={busy || isOnlyPeriod}
              onClick={() => removePeriod(period)}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        )
      )}

      {draft && !draft.id && renderDraft()}

      {!draft && (
        <Button
          size="small"
          disabled={busy}
          onClick={() =>
            // Defaults to this month, so the common edit ("it is going up from
            // now") never reaches back and re-costs months already recorded.
            setDraft({
              amount: "",
              validFrom: dayjs().startOf("month").toDate(),
            })
          }
        >
          + Add a change
        </Button>
      )}
    </Box>
  );
};
