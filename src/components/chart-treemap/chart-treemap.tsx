import ReactECharts from "echarts-for-react";
import { CategoryExpenseTotal } from "../../generated/graphql";

type ChartTreemapProps = {
  data: CategoryExpenseTotal[];
  width?: string | number;
  height?: string | number;
};

export const ChartTreemap = ({
  data,
  width = "100%",
  height = 400,
}: ChartTreemapProps) => {
  // 1) Nest your flat data into a tree shape
  const categoryMap: Record<string, { name: string; children: any[] }> = {};
  data.forEach(({ categoryName, subcategoryName, total }) => {
    if (!categoryMap[categoryName]) {
      categoryMap[categoryName] = { name: categoryName, children: [] };
    }
    categoryMap[categoryName].children.push({
      name: subcategoryName,
      value: total,
    });
  });
  const treeData = Object.values(categoryMap);

  // 2) Build the echarts option
  const option = {
    tooltip: {
      formatter: ({ name, value, treePathInfo }: any) => {
        // Show full path in tooltip
        const path = treePathInfo.map((n: any) => n.name).join(" / ");
        return `<strong>${path}</strong><br/>${value}`;
      },
    },
    series: [
      {
        type: "treemap",
        data: treeData,
        // allow pan & zoom
        roam: true,
        // show breadcrumb navigation at top
        breadcrumb: {
          show: true,
          left: "center",
          top: 8,
          itemStyle: { color: "#555" },
        },
        label: {
          show: true,
          formatter: "{b}\n{c}",
          fontSize: 12,
        },
        upperLabel: {
          show: true,
          height: 30,
          formatter: "{b}",
          color: "#000",
          fontWeight: "bold",
        },
        // styling each node can go here if desired
        // levels can define different styles per depth
        levels: [
          {
            // root level (not displayed)
          },
          {
            // category level
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: true,
              fontSize: 14,
            },
          },
          {
            // subcategory level
            colorSaturation: [0.35, 0.6],
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 1,
            },
            label: {
              fontSize: 12,
            },
          },
        ],
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ width, height }}
      opts={{ renderer: "canvas" }} // canvas for performance on mobile
    />
  );
};
