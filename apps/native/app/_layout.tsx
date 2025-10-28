import "react-native-reanimated"; // MUST be the first line
import { Slot } from "expo-router";
import { AuthProvider } from "@/providers/AuthProvider";

/**
 * Root Layout - Entry point for the app
 * Wraps entire app with AuthProvider which provides:
 * - Apollo Client for GraphQL
 * - Authentication state (token, user)
 * - UserContext (currency, similar to web app)
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
