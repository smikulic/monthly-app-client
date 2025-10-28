import { StyleSheet } from "react-native";

/**
 * Header Component Styles
 * Defines the styling for the native header component
 */
export const headerStyles = StyleSheet.create({
  // Main header container
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  // Left side (back button area)
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginRight: 8,
  },

  backButtonText: {
    fontSize: 16,
    color: "#007AFF", // iOS blue
    marginLeft: 4,
  },

  // Right side (user info area)
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  userName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },

  // Avatar
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#41efcd", // Primary color from web app
  },

  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  // Menu button (when no avatar)
  menuButton: {
    padding: 8,
    backgroundColor: "#f199c0", // Secondary color from web app
    borderRadius: 16,
  },

  // Menu Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },

  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  // Menu Items
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  menuItemIcon: {
    marginRight: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  menuItemText: {
    fontSize: 16,
    color: "#333",
  },

  menuItemLogout: {
    color: "#ff7777", // Error color from web app
  },

  // Cancel button
  cancelButton: {
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },

  cancelButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
});
