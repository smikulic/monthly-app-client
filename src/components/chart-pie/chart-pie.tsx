import { useContext, useMemo } from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import { useTheme } from "@/hooks/useTheme";
import { useResponsive } from "@/hooks/useResponsive";
import { CategoryExpenseTotal } from "@/generated/graphql";
import { UserContext } from "@/App";
import { formatAmount } from "@/utils/format";

// register only the modules we need
echarts.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

type ChartPieProps = {
  data: CategoryExpenseTotal[];
  width?: string | number;
  height?: string | number;
  padWidth?: number; // gap between slices in px
};

export const ChartPie = ({
  data,
  width = "100%",
  height = 400,
  padWidth = 2,
}: ChartPieProps) => {
  const { palette } = useTheme();
  const { isMobile } = useResponsive();
  const userCurrency = useContext(UserContext);

  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach(({ categoryName, total }) => {
      map[categoryName] = (map[categoryName] || 0) + total;
    });
    return map;
  }, [data]);
  const categories = Object.keys(categoryTotals);

  // memoize the category→color map so it only changes when categories or palette change
  const categoryColorMap = useMemo<Record<string, string>>(() => {
    const colors = [
      palette.primary.main,
      palette.secondary.main,
      palette.error.main,
      palette.warning.main,
      palette.info.main,
      palette.success.main,
    ];
    const map: Record<string, string> = {};
    categories.forEach((cat, i) => {
      map[cat] = colors[i % colors.length];
    });
    return map;
  }, [
    categories,
    palette.primary.main,
    palette.secondary.main,
    palette.error.main,
    palette.warning.main,
    palette.info.main,
    palette.success.main,
  ]);

  // 2) Prepare inner (categories) and outer (subcategories) series data
  const innerData = useMemo(
    () =>
      categories.map((cat) => ({
        name: `${cat} (${formatAmount(categoryTotals[cat], userCurrency)})`,
        value: categoryTotals[cat],
        itemStyle: { color: categoryColorMap[cat] },
      })),
    [categories, categoryTotals, categoryColorMap, userCurrency]
  );

  // outer data: grouped by category so siblings sit next to each other
  const outerData = useMemo(() => {
    return categories.flatMap((cat) =>
      data
        .filter((d) => d.categoryName === cat)
        .map(({ subcategoryName, total }) => ({
          name: `${subcategoryName} (${formatAmount(total, userCurrency)})`,
          value: total,
          itemStyle: { color: categoryColorMap[cat] },
        }))
    );
  }, [data, categories, categoryColorMap, userCurrency]);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => categoryTotals[b] - categoryTotals[a]),
    [categories, categoryTotals]
  );

  const legendData = useMemo(() => {
    return sortedCategories.flatMap((cat) => {
      // find the exact innerData name (with formatted amount)
      const catName = innerData.find((d) =>
        d.name.startsWith(cat + " (")
      )!.name;

      // then all its subcategory names
      const subNames = outerData
        .filter((d) => d.itemStyle.color === categoryColorMap[cat])
        .map((d) => d.name);

      return [catName, ...subNames];
    });
  }, [sortedCategories, innerData, outerData, categoryColorMap]);

  const innerFontSize = isMobile ? 10 : 14;
  const lineLength = isMobile ? 5 : 12;
  const tooltipFont = isMobile ? 12 : 14;

  const option = useMemo(
    () => ({
      tooltip: {
        trigger: "item",
        confine: true,
        textStyle: { fontSize: tooltipFont },
        formatter: ({ name, percent }: { name: string; percent: number }) =>
          `${name}: (${percent}%)`,
        // formatter: "{b}: {c} ({d}%)",
      },
      series: [
        {
          name: "Categories",
          type: "pie",
          radius: ["0%", "55%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          padAngle: padWidth,
          itemStyle: {
            borderColor: "#fff",
            borderWidth: padWidth,
            borderRadius: 4,
          },
          label: {
            show: false,
            // show: !isMobile,
            position: "inside",
            fontSize: innerFontSize,
            formatter: ({ name }: { name: string }) => name,
            // formatter: "{b}\n{c}",
          },
          labelLine: {
            show: !isMobile,
            length: lineLength,
            smooth: true,
          },
          // emphasis: {
          //   label: { show: true, fontSize: innerFontSize + 2 },
          // },
          data: innerData,
        },
        {
          name: "Subcategories",
          type: "pie",
          radius: ["70%", "90%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          padAngle: 1,
          itemStyle: {
            borderColor: "#fff",
            borderWidth: padWidth,
            borderRadius: 4,
          },
          label: {
            show: !isMobile,
            position: "outside",
            formatter: ({ name }: { name: string }) => name,
            // formatter: "{b}",
          },
          labelLine: {
            show: !isMobile,
            length: lineLength,
            smooth: true,
          },
          // tooltip: { show: isMobile },
          data: outerData,
        },
      ],
      // 5) add a scrollable legend on mobile
      legend: {
        show: true,
        // on mobile: horizontal, at the bottom
        orient: isMobile ? "horizontal" : "vertical",
        bottom: isMobile ? 0 : undefined,
        left: isMobile ? "center" : undefined,
        // on desktop: vertical, on the right, centered vertically
        right: isMobile ? undefined : 0,
        top: isMobile ? undefined : "middle",
        itemGap: isMobile ? 8 : 12,
        textStyle: { fontSize: isMobile ? 10 : 12 },
        // scroll the legend if it overflows
        type: "scroll",
        width: isMobile ? "90%" : undefined,
        data: legendData,
      },
    }),
    [
      innerData,
      outerData,
      padWidth,
      legendData,
      isMobile,
      innerFontSize,
      lineLength,
      tooltipFont,
    ]
  );

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ width, height }}
      opts={{ renderer: "canvas" }}
    />
  );
};
