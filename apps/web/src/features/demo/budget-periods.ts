/**
 * Budget accrual maths, mirrored from the server.
 *
 * The original is `monthly-app-server/src/utils/budgetPeriods.ts`. It lives
 * there because it is the truth for every real account; it is duplicated here
 * because the demo answers its own queries with no server in the loop, and
 * there is no shared package to put it in (`packages/` is empty and adding one
 * for two functions would cost more than it saves).
 *
 * The duplication is pinned by `budget-periods.test.ts`, which restates the
 * cases the server's own test covers. If the two ever disagree, the demo shows
 * a rollover figure the real app would not — which is the whole reason this is
 * tested rather than trusted.
 *
 * Every period boundary is the first of a month in UTC: budgets are monthly, so
 * a day component would only leave it ambiguous which month an amount first
 * applies to.
 */

export interface BudgetPeriod {
  amount: number;
  validFrom: Date;
}

/** Normalises a date down to the first of its month, UTC. */
export const toMonthStartUTC = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

/** `YYYY-MM-DD`, the `MM-DD-YYYY` the pages send, or anything Date parses. */
export function parseMonthStartUTC(value: string): Date {
  const iso = /^(\d{4})-(\d{2})/.exec(value);
  if (iso) {
    return new Date(Date.UTC(Number(iso[1]), Number(iso[2]) - 1, 1));
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), 1));
}

const addMonthsUTC = (month: Date, count: number): Date =>
  new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + count, 1));

/** Months in the half-open range: `until` is not counted. */
const countMonths = (from: Date, until: Date): number =>
  (until.getUTCFullYear() - from.getUTCFullYear()) * 12 +
  (until.getUTCMonth() - from.getUTCMonth());

/**
 * The amount in force for a month, or null before the schedule opens.
 *
 * Periods must be sorted by `validFrom` ascending.
 */
export function amountForMonth(
  periods: BudgetPeriod[],
  month: Date,
): number | null {
  const viewedMonth = toMonthStartUTC(month);
  let amountInForce: number | null = null;

  // Each period that has started overwrites the one before it, so whatever
  // survives the walk is the one covering the viewed month.
  for (const period of periods) {
    if (toMonthStartUTC(period.validFrom) > viewedMonth) break;
    amountInForce = period.amount;
  }

  return amountInForce;
}

/**
 * Everything the budget has accrued from the schedule's start through the end
 * of the viewed month.
 *
 * Summed per period rather than multiplied by one amount: a subcategory that
 * went from 380 to 450 accrued 380 a month for the months it was 380, and
 * multiplying the whole span by today's figure re-costs a year of history.
 */
export function accruedBudget(periods: BudgetPeriod[], month: Date): number {
  const viewedMonth = toMonthStartUTC(month);
  const monthAfterViewed = addMonthsUTC(viewedMonth, 1);
  let total = 0;

  for (let index = 0; index < periods.length; index++) {
    const period = periods[index];
    const periodStarts = toMonthStartUTC(period.validFrom);

    // Sorted ascending, so nothing after this has started either.
    if (periodStarts > viewedMonth) break;

    const next = periods[index + 1];
    const nextStarts = next ? toMonthStartUTC(next.validFrom) : null;
    const isSuperseded = nextStarts !== null && nextStarts <= viewedMonth;

    /*
     * Exclusive on purpose. A superseded period stops *before* the month the
     * next one takes over, so that month is counted once, at the new amount. A
     * period still in force stops before the month after the one being viewed,
     * which is how the viewed month itself gets counted.
     */
    const stopsBefore = isSuperseded ? nextStarts : monthAfterViewed;
    total += countMonths(periodStarts, stopsBefore) * period.amount;
  }

  return total;
}
