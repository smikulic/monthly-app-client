import { Dispatch, SetStateAction, useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { gql, useMutation, useQuery } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { AUTH_TOKEN, AUTH_TOKEN_USER } from "@/constants";
import { loginPageStyles as styles } from "./login-page-styles";

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

const WEB_BASE_URL = "https://app.yourmonthly.app";
const SIGNUP_URL = `${WEB_BASE_URL}/`;
const RESET_URL = `${WEB_BASE_URL}/`;

export function LoginPageContainer({
  setToken,
}: {
  setToken: Dispatch<SetStateAction<string | null>>;
}) {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  // Login
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
    onCompleted: ({ login }) => {
      SecureStore.setItem(AUTH_TOKEN, login?.token!);
      SecureStore.setItem(AUTH_TOKEN_USER, login?.user?.email!);
      setToken(login?.token!);

      router.replace("/");
    },
  });

  const { data: googleAuthUrlData } = useQuery(GOOGLE_AUTH_URL_QUERY);

  // Open web signup
  const openSignupInBrowser = async () => {
    try {
      // you can pass email as a hint to your web page
      const url =
        formState.email?.length > 0
          ? `${SIGNUP_URL}&email=${encodeURIComponent(formState.email)}`
          : SIGNUP_URL;
      await WebBrowser.openBrowserAsync(url);
    } catch (e) {
      Alert.alert("Could not open the browser", String(e));
    }
  };

  // Open web reset
  const openResetInBrowser = async () => {
    try {
      const url =
        formState.email?.length > 0
          ? `${RESET_URL}?email=${encodeURIComponent(formState.email)}`
          : RESET_URL;
      await WebBrowser.openBrowserAsync(url);
    } catch (e) {
      Alert.alert("Could not open the browser", String(e));
    }
  };

  const handleGoogleLogin = async () => {
    const url = googleAuthUrlData?.googleAuthUrl?.url;
    if (!url) {
      Alert.alert("Google authentication is not available right now");
      return;
    }
    // Open OAuth in system browser
    await WebBrowser.openBrowserAsync(url);
    // You’ll likely finish the OAuth with a deep link back into the app,
    // then call GOOGLE_LOGIN_MUTATION({ variables: { code } })
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

            <Pressable onPress={handleGoogleLogin} style={styles.button}>
              <Text>Sign in with Google</Text>
            </Pressable>

            <View style={styles.divider} />

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
