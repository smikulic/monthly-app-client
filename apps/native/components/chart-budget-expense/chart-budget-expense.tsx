import { View, Text, StyleSheet } from "react-native";

/**
 * Budget vs Expenses Line Chart
 * Placeholder - charts will be implemented later
 */

type ChartBudgetExpenseProps = {
  totalBudgetAmount: number;
  chartExpensesData: number[];
  pageDate: Date;
};

export const ChartBudgetExpense = ({
  totalBudgetAmount,
  chartExpensesData,
  pageDate,
}: ChartBudgetExpenseProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>📊 Budget vs Expenses Chart</Text>
      <Text style={styles.subtext}>Coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
  },

  placeholder: {
    fontSize: 24,
    color: "#878BAC",
    marginBottom: 8,
  },

  subtext: {
    fontSize: 16,
    color: "#c0c0c0",
  },
});
