import { LineChart } from "@mui/x-charts/LineChart";
import { months } from "../../constants";

export const ChartBudgetExpense = ({
  totalBudgetAmount,
  chartExpensesData,
  pageDate,
}: {
  totalBudgetAmount: number;
  chartExpensesData: number[];
  pageDate: Date;
}) => {
  const selectedYear = pageDate.getFullYear();

  return (
    <LineChart
      yAxis={[{ id: "budgetOverview" }]}
      xAxis={[
        {
          id: "yearOverview",
          data: months,
          scaleType: "band",
          label: `${selectedYear}`,
        },
      ]}
      leftAxis={{
        axisId: "budgetOverview",
        disableLine: true,
        disableTicks: true,
        tickFontSize: 10,
      }}
      bottomAxis={{
        axisId: "yearOverview",
        disableLine: true,
        disableTicks: true,
        tickFontSize: 10,
      }}
      series={[
        {
          data: chartExpensesData,
          area: true,
          label: "Expenses",
          color: "#ff7777",
        },
        {
          data: new Array(12).fill(totalBudgetAmount),
          label: "Budget",
          color: "#eec22f",
          showMark: false,
        },
      ]}
      height={300}
    />
  );
};
