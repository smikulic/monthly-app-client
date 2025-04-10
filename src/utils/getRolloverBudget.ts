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
  // Calculate the number of complete months that have passed
  const monthsPassed = Math.floor(
    (currentDate.getFullYear() - rolloverDate.getFullYear()) * 12 +
      currentDate.getMonth() -
      rolloverDate.getMonth()
  );

  // Total accrued budget from rollover month onward
  const totalAccruedBudget = (monthsPassed + 1) * budgetAmount;

  // Remaining rollover budget after subtracting spent amount
  return totalAccruedBudget - totalExpensesSinceRollover;
};
