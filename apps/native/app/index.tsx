import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import { LoginPageContainer } from "@/pages/login-page/login-page-container";
import { Header } from "@/components/layout";
import { HomePageContainer } from "@/pages/home-page/home-page-container";

/**
 * Main App Screen
 * Shows login page if not authenticated, otherwise shows the home page
 */
export default function App() {
  // Get auth state from context
  const { token, loading } = useAuth();

  // Date navigation state (for expenses/budget filtering)
  const currentDate = new Date();
  const [pageDate, setPageDate] = useState(currentDate);

  // Navigate to next month
  const onClickNext = () => {
    const nextDate = new Date(
      pageDate.getFullYear(),
      pageDate.getMonth() + 1,
      pageDate.getDate()
    );
    setPageDate(nextDate);
  };

  // Navigate to previous month
  const onClickPrevious = () => {
    const previousDate = new Date(
      pageDate.getFullYear(),
      pageDate.getMonth() - 1,
      pageDate.getDate()
    );
    setPageDate(previousDate);
  };

  // Show loading while checking auth
  if (loading) {
    return null;
  }

  // Show login page if not authenticated
  if (!token) {
    return <LoginPageContainer />;
  }

  // Main app content (authenticated user)
  return (
    <View style={styles.container}>
      {/* Header with user info and menu */}
      <Header />

      {/* Home Page with Dashboard */}
      <HomePageContainer
        pageDate={pageDate}
        onClickNext={onClickNext}
        onClickPrevious={onClickPrevious}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
