/**
 * Which budget figure to show, and whether it has been passed.
 *
 * Both depend on the rollover toggle, and getting it wrong is silent: with
 * rollover on the figure is what *remains* (so over means it went negative),
 * with it off the figure is the month's *budget* (so over means spend passed
 * it). The rule is shared so the category row and the subcategory rows beneath
 * it cannot disagree.
 */
export const getBudgetStatus = ({
  showRollover,
  budgetForMonth,
  rolloverRemaining,
  spent,
}: {
  showRollover: boolean;
  /** The amount that applied in the viewed month. 0 before the schedule opens. */
  budgetForMonth: number;
  /** Accrued to the end of that month, minus everything spent. */
  rolloverRemaining: number;
  spent: number;
}) => {
  const budgetValue = showRollover ? rolloverRemaining : budgetForMonth;
  // Nothing to show for a month the budget did not exist in yet.
  const hasStarted = budgetForMonth > 0;

  return {
    budgetValue,
    hasStarted,
    over: hasStarted && (showRollover ? budgetValue < 0 : spent > budgetValue),
    label: showRollover ? "left" : "budget",
  };
};
