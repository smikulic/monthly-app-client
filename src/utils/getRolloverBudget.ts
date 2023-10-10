export const getRolloverBudget = ({
  currentDate,
  createdAt,
  budgetAmount,
}: {
  currentDate: Date;
  createdAt: string;
  budgetAmount: number;
}) => {
  const budgetStart = new Date(Number(createdAt));

  const monthsPassed = Math.floor(
    (currentDate.getFullYear() - budgetStart.getFullYear()) * 12 +
      currentDate.getMonth() -
      budgetStart.getMonth()
  );

  const rolloverBudget = monthsPassed * budgetAmount + budgetAmount;

  return rolloverBudget;
};
