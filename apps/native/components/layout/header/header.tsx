import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/providers/AuthProvider";
import { AUTH_TOKEN_USER } from "@/constants";
import * as SecureStore from "expo-secure-store";
import { headerStyles as styles } from "./header-styles";

/**
 * Header Component
 * Similar to web app's header with:
 * - Back button (when not on home)
 * - User name display
 * - User avatar/menu button
 * - Menu with Profile, Reports, Logout
 */
export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [menuVisible, setMenuVisible] = useState(false);

  // Check if we're on the home page
  const isHome = pathname === "/";

  // Get user display name
  // Priority: Google name > email prefix
  const getUserName = () => {
    if (user?.name) return user.name;

    // Fallback to email prefix from secure storage
    const email = SecureStore.getItem(AUTH_TOKEN_USER);
    if (email) {
      return email.split("@")[0];
    }

    return user?.email?.split("@")[0] || "User";
  };

  const userName = getUserName();
  const userPicture = user?.picture;

  /**
   * Handle back button press
   * Navigate to home page
   */
  const handleBackPress = () => {
    router.push("/");
  };

  /**
   * Handle menu item selection
   */
  const handleMenuPress = () => {
    setMenuVisible(true);
  };

  const handleProfilePress = () => {
    setMenuVisible(false);
    // TODO: Navigate to profile page
    // router.push("/profile");
    console.log("Navigate to profile");
  };

  const handleReportsPress = () => {
    setMenuVisible(false);
    // TODO: Navigate to reports page
    // router.push("/reports");
    console.log("Navigate to reports");
  };

  const handleLogoutPress = async () => {
    setMenuVisible(false);
    await logout();
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  return (
    <>
      <View style={styles.header}>
        {/* Left Section - Back Button */}
        <View style={styles.leftSection}>
          {!isHome && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#007AFF" />
              <Text style={styles.backButtonText}>back</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Right Section - User Info & Menu */}
        <View style={styles.rightSection}>
          <Text style={styles.userName}>{userName}</Text>

          {/* Avatar or Menu Button */}
          <TouchableOpacity onPress={handleMenuPress} activeOpacity={0.7}>
            {userPicture ? (
              <Image
                source={{ uri: userPicture }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.menuButton}>
                <Ionicons name="menu" size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseMenu}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseMenu}>
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Menu</Text>
            </View>

            {/* Menu Items */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleProfilePress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemIcon}>
                <Ionicons name="person-circle-outline" size={24} color="#333" />
              </View>
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleReportsPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemIcon}>
                <Ionicons name="bar-chart-outline" size={24} color="#333" />
              </View>
              <Text style={styles.menuItemText}>Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogoutPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemIcon}>
                <Ionicons name="log-out-outline" size={24} color="#ff7777" />
              </View>
              <Text style={[styles.menuItemText, styles.menuItemLogout]}>
                Logout
              </Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCloseMenu}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
