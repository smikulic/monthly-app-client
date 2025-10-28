import { StyleSheet } from "react-native";

/**
 * Actions Bar Styles
 * Month navigation component styling
 */
export const actionsBarStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: 12,
    height: 56,
    backgroundColor: "#fff",
  },

  button: {
    padding: 4,
  },

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 148,
  },

  dateText: {
    fontSize: 17,
    color: "#181818",
  },
});
