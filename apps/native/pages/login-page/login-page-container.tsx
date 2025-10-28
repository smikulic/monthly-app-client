import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Alert, Linking } from "react-native";
import { gql, useMutation, useQuery } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { AUTH_TOKEN_USER } from "@/constants";
import { useAuth } from "@/providers/AuthProvider";
import { loginPageStyles as styles } from "./login-page-styles";

// ============================================================================
// GraphQL Operations
// ============================================================================

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        picture
        provider
      }
    }
  }
`;

export const GOOGLE_LOGIN_MUTATION = gql`
  mutation GoogleLogin($code: String!) {
    googleLogin(code: $code) {
      token
      user {
        id
        email
        name
        picture
        provider
      }
    }
  }
`;

export const GOOGLE_AUTH_URL_QUERY = gql`
  query GoogleAuthUrl {
    googleAuthUrl {
      url
    }
  }
`;

// ============================================================================
// Constants
// ============================================================================

const WEB_BASE_URL = "https://app.yourmonthly.app";
const SIGNUP_URL = `${WEB_BASE_URL}/?mode=signup`;
const RESET_URL = `${WEB_BASE_URL}/?mode=reset`;

// ============================================================================
// Login Page Component
// ============================================================================

/**
 * Login Page Container
 * Handles email/password login and Google OAuth
 */
export function LoginPageContainer() {
  // Get setToken from auth context
  const { setToken } = useAuth();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  // Email/Password Login Mutation
  const [loginAction, loginState] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password,
    },
    onError: (error) => {
      if (
        error.message?.includes("confirm your email") ||
        error.message?.includes("Email not confirmed")
      ) {
        Alert.alert("Please confirm your email first. Check your inbox.");
      } else {
        Alert.alert(error.message);
      }
    },
    onCompleted: async ({ login }) => {
      // Store user email for fallback display
      await SecureStore.setItemAsync(AUTH_TOKEN_USER, login?.user?.email!);
      // Set token in auth context (this triggers refetch of user data)
      await setToken(login?.token!);

      // Navigation handled by app/index.tsx automatically
    },
  });

  // Get Google OAuth URL
  const { data: googleAuthUrlData } = useQuery(GOOGLE_AUTH_URL_QUERY);

  // Google Login Mutation
  const [googleLoginAction] = useMutation(GOOGLE_LOGIN_MUTATION, {
    onError: (error) => {
      Alert.alert("Google login failed", error.message);
    },
    onCompleted: async ({ googleLogin }) => {
      // Store user email
      await SecureStore.setItemAsync(
        AUTH_TOKEN_USER,
        googleLogin?.user?.email!
      );
      // Set token in auth context
      await setToken(googleLogin?.token!);
      // Navigation handled by app/index.tsx automatically
    },
  });

  // Listen for deep links (Google OAuth callback)
  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      const parsedUrl = new URL(url);

      // Check if this is a Google OAuth callback
      if (parsedUrl.pathname === "/auth/google/callback") {
        const code = parsedUrl.searchParams.get("code");
        const error = parsedUrl.searchParams.get("error");

        if (error) {
          Alert.alert("Google authentication failed", error);
          return;
        }

        if (code) {
          // Call Google login mutation with the authorization code
          googleLoginAction({ variables: { code } });
        }
      }
    };

    // Get initial URL (app opened via deep link)
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    // Listen for deep link events while app is running
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => subscription.remove();
  }, [googleLoginAction]);

  /**
   * Open signup page in browser
   * Uses web app for account creation with mode=signup parameter
   */
  const openSignupInBrowser = async () => {
    try {
      // Pass email as a hint to the web page
      const url =
        formState.email?.length > 0
          ? `${SIGNUP_URL}&email=${encodeURIComponent(formState.email)}`
          : SIGNUP_URL;
      await WebBrowser.openBrowserAsync(url);
    } catch (e) {
      Alert.alert("Could not open the browser", String(e));
    }
  };

  /**
   * Open password reset page in browser
   * Uses web app for password reset flow with mode=reset parameter
   */
  const openResetInBrowser = async () => {
    try {
      const url =
        formState.email?.length > 0
          ? `${RESET_URL}&email=${encodeURIComponent(formState.email)}`
          : RESET_URL;
      await WebBrowser.openBrowserAsync(url);
    } catch (e) {
      Alert.alert("Could not open the browser", String(e));
    }
  };

  /**
   * Handle Google OAuth login
   * Opens OAuth flow using auth session which automatically handles callback
   */
  const handleGoogleLogin = async () => {
    const url = googleAuthUrlData?.googleAuthUrl?.url;
    if (!url) {
      Alert.alert("Google authentication is not available right now");
      return;
    }

    try {
      // Use openAuthSessionAsync for OAuth flows
      // Backend redirects to: https://app.yourmonthly.app/auth/google/callback?code=xxx
      // iOS will intercept this via universal links and open our app
      const result = await WebBrowser.openAuthSessionAsync(
        url,
        "https://app.yourmonthly.app/auth/google/callback" // Web redirect URI (universal link)
      );

      console.log("OAuth result:", result);

      if (result.type === "success" && result.url) {
        console.log("Callback URL:", result.url);

        // Parse the callback URL
        const parsedUrl = new URL(result.url);
        const code = parsedUrl.searchParams.get("code");
        const error = parsedUrl.searchParams.get("error");

        if (error) {
          Alert.alert("Google authentication failed", error);
          return;
        }

        if (code) {
          console.log("Got authorization code, calling googleLogin mutation");
          // Call Google login mutation with the authorization code
          await googleLoginAction({ variables: { code } });
        } else {
          console.log("No code in callback URL");
        }
      } else if (result.type === "cancel") {
        console.log("User cancelled OAuth flow");
      } else {
        console.log("OAuth result type:", result.type);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      Alert.alert("Authentication error", String(error));
    }
  };

  return (
    <View style={styles.loginPage}>
      <>
        <Text style={styles.title}>Login</Text>

        <View style={styles.form}>
          <View style={styles.formField}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              value={formState.email}
              onChangeText={(email) => setFormState({ ...formState, email })}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter your email"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={formState.password}
              onChangeText={(password) =>
                setFormState({ ...formState, password })
              }
              secureTextEntry
              placeholder="Enter your password"
            />
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.button} onPress={() => loginAction()}>
              <Text>Login</Text>
            </Pressable>

            <View style={styles.divider} />

            {/* TODO: Fix Google OAuth deep linking */}
            {/* <Pressable onPress={handleGoogleLogin} style={styles.button}>
              <Text>Sign in with Google</Text>
            </Pressable>

            <View style={styles.divider} /> */}

            {/* Create account → open browser */}
            <Pressable onPress={openSignupInBrowser}>
              <Text>
                need to create an account? register{" "}
                <Text style={styles.link}>here</Text>
              </Text>
            </Pressable>

            <View style={styles.dividerText} />

            {/* Forgot password → open browser */}
            <Pressable onPress={openResetInBrowser}>
              <Text>
                Forgot your password? reset{" "}
                <Text style={styles.link}>here</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </>
    </View>
  );
}
