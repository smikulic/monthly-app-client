import { useContext } from "react";
import { useTheme } from "@mui/material";
import { UserContext } from "../../App";
import { formatAmount } from "../../utils/format";
import { PieChart } from "@mui/x-charts/PieChart";
import { CategoryExpenseTotal } from "../../generated/graphql";

export const ChartCategories = ({ data }: { data: CategoryExpenseTotal[] }) => {
  const theme = useTheme();
  const userCurrency = useContext(UserContext);

  // 1) pick a palette
  const palette = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
  ];

  // 2) compute unique categories & per‐category totals
  const categoryTotals = data?.reduce<Record<string, number>>((acc, d) => {
    acc[d.categoryName] = (acc[d.categoryName] || 0) + d.total;
    return acc;
  }, {});

  const categories = data ? Object.keys(categoryTotals) : [];

  // 3) map categories to colors
  const categoryColorMap: Record<string, string> = {};
  categories.forEach((cat, i) => {
    categoryColorMap[cat] = palette[i % palette.length];
  });

  // 4) sort categories by total descending
  const sortedCategories = categories.sort(
    (a, b) => categoryTotals[b] - categoryTotals[a]
  );

  // 5) build a sorted flat list: for each category, its subcategories sorted by their own total
  const sortedData = sortedCategories.flatMap((cat) =>
    data.filter((d) => d.categoryName === cat).sort((a, b) => b.total - a.total)
  );

  const chartCategoriesSeriesData = sortedData.map((d, idx) => ({
    id: `${idx}`,
    value: d.total,
    label: `${d.categoryName} — ${d.subcategoryName}: ${formatAmount(
      d.total,
      userCurrency
    )}`,
    color: categoryColorMap[d.categoryName],
  }));

  return (
    <PieChart
      series={[
        {
          data: chartCategoriesSeriesData,
          innerRadius: 35,
          outerRadius: 120,
          paddingAngle: 2,
          cx: 120,
        },
      ]}
      height={300}
      // margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
      slotProps={{
        legend: {
          direction: "column",
          position: { vertical: "middle", horizontal: "right" },
          // padding: 2,
          labelStyle: {
            fontSize: "12px",
          },
        },
      }}
    />
  );
};
