export const getRolloverBudget = ({
  currentDate,
  budgetStartDate,
  budgetAmount,
}: {
  currentDate: Date;
  budgetStartDate: Date;
  budgetAmount: number;
}) => {
  const monthsPassed = Math.floor(
    (currentDate.getFullYear() - budgetStartDate.getFullYear()) * 12 +
      currentDate.getMonth() -
      budgetStartDate.getMonth()
  );

  const rolloverBudget = monthsPassed * budgetAmount + budgetAmount;

  return rolloverBudget;
};
