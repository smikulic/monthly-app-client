export const getRolloverBudget = ({
  currentDate,
  rolloverDate,
  budgetAmount,
}: {
  currentDate: Date;
  rolloverDate: Date;
  budgetAmount: number;
}) => {
  const monthsPassed = Math.floor(
    (currentDate.getFullYear() - rolloverDate.getFullYear()) * 12 +
      currentDate.getMonth() -
      rolloverDate.getMonth()
  );

  const rolloverBudget = monthsPassed * budgetAmount + budgetAmount;

  return rolloverBudget;
};

export const getRemainingRolloverBudget = ({
  currentDate,
  rolloverDate,
  budgetAmount,
  totalExpensesSinceRollover,
}: {
  currentDate: Date;
  rolloverDate: Date;
  budgetAmount: number;
  totalExpensesSinceRollover: number;
}) => {
  // normalize both to the 1st of their months
  const rollStart = new Date(
    rolloverDate.getFullYear(),
    rolloverDate.getMonth(),
    1
  );
  const viewStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // months difference (calendar), clamped at 0
  let monthsPassed =
    (viewStart.getFullYear() - rollStart.getFullYear()) * 12 +
    (viewStart.getMonth() - rollStart.getMonth());

  if (monthsPassed < 0) {
    monthsPassed = 0;
  }

  // Start-of-month accrual => include the viewed month (+1)
  const accruedMonths = monthsPassed + 1;
  const totalAccruedBudget = accruedMonths * budgetAmount;

  // Remaining (can be negative)
  return totalAccruedBudget - totalExpensesSinceRollover;
};
