import { View, Text, StyleSheet } from "react-native";

/**
 * Category Pie Chart
 * Placeholder - charts will be implemented later
 */

type CategoryExpenseTotal = {
  categoryName: string;
  subcategoryName: string;
  total: number;
};

type ChartPieProps = {
  data: CategoryExpenseTotal[];
};

export const ChartPie = ({ data }: ChartPieProps) => {
  // Validate data
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No category data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>🥧 Category Pie Chart</Text>
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

  errorText: {
    fontSize: 16,
    color: "#878BAC",
  },
});
