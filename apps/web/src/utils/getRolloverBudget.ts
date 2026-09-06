export interface BudgetPeriod {
  amount: number;
  /** First month this amount applies to. The day component is ignored. */
  validFrom: Date;
}

/** Budgets accrue by whole months, so every boundary collapses to its 1st. */
const monthStart = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const addMonths = (date: Date, months: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + months, 1);

const monthsBetween = (from: Date, to: Date): number =>
  (to.getFullYear() - from.getFullYear()) * 12 +
  (to.getMonth() - from.getMonth());

/**
 * Everything the budget has accrued from the schedule's start through the end of
 * the viewed month.
 *
 * Summed per period rather than multiplied by one amount: a subcategory that
 * went from 100 to 700 accrued 100 a month for the months it was 100, and
 * multiplying the whole span by today's figure re-costs years of history. Months
 * before the schedule opens accrue nothing rather than going negative.
 */
export const getAccruedBudget = ({
  periods,
  currentDate,
}: {
  periods: BudgetPeriod[];
  currentDate: Date;
}): number => {
  const view = monthStart(currentDate);
  const sorted = [...periods].sort(
    (a, b) => monthStart(a.validFrom).getTime() - monthStart(b.validFrom).getTime()
  );

  let total = 0;

  for (let i = 0; i < sorted.length; i++) {
    const start = monthStart(sorted[i].validFrom);
    if (start > view) break;

    // A period runs until the next one opens, or to the end of the viewed
    // month when it is the last one still in force.
    const nextStart = sorted[i + 1]
      ? monthStart(sorted[i + 1].validFrom)
      : null;
    const end = nextStart && nextStart <= view ? nextStart : addMonths(view, 1);

    total += monthsBetween(start, end) * sorted[i].amount;
  }

  return total;
};

/**
 * The amount that applies in the viewed month, or null before the schedule
 * opens. This is what a month-by-month view should show: looking back at
 * December 2025 reports what the budget was then, not what it is now.
 */
export const getAmountForMonth = ({
  periods,
  currentDate,
}: {
  periods: BudgetPeriod[];
  currentDate: Date;
}): number | null => {
  const view = monthStart(currentDate);
  const sorted = [...periods].sort(
    (a, b) => monthStart(a.validFrom).getTime() - monthStart(b.validFrom).getTime()
  );

  let amount: number | null = null;
  for (const period of sorted) {
    if (monthStart(period.validFrom) > view) break;
    amount = period.amount;
  }

  return amount;
};

/**
 * `periods` is the real schedule. The flat `rolloverDate` + `budgetAmount` pair
 * is the one-period fallback for callers that have not been passed a schedule
 * yet, and produces exactly what it always did.
 */
const periodsFor = ({
  periods,
  rolloverDate,
  budgetAmount,
}: {
  periods?: BudgetPeriod[];
  rolloverDate: Date;
  budgetAmount: number;
}): BudgetPeriod[] =>
  periods && periods.length > 0
    ? periods
    : [{ amount: budgetAmount, validFrom: rolloverDate }];

export const getRolloverBudget = ({
  currentDate,
  rolloverDate,
  budgetAmount,
  periods,
}: {
  currentDate: Date;
  rolloverDate: Date;
  budgetAmount: number;
  periods?: BudgetPeriod[];
}) =>
  getAccruedBudget({
    periods: periodsFor({ periods, rolloverDate, budgetAmount }),
    currentDate,
  });

export const getRemainingRolloverBudget = ({
  currentDate,
  rolloverDate,
  budgetAmount,
  totalExpensesSinceRollover,
  periods,
}: {
  currentDate: Date;
  rolloverDate: Date;
  budgetAmount: number;
  totalExpensesSinceRollover: number;
  periods?: BudgetPeriod[];
}) =>
  getAccruedBudget({
    periods: periodsFor({ periods, rolloverDate, budgetAmount }),
    currentDate,
  }) - totalExpensesSinceRollover;
