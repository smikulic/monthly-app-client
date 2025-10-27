import { useState } from "react";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Pressable, Text, View } from "react-native";
import { gql, ServerError, useQuery } from "@apollo/client";
import { AUTH_TOKEN, AUTH_TOKEN_USER } from "../constants";
import { handleLogout } from "@/utils/handleLogout";
import { LoginPageContainer } from "@/pages/login-page/login-page-container";

const GET_USER_ME = gql`
  query {
    me {
      id
      email
      currency
      weeklyReminder
      name
      picture
      provider
    }
  }
`;

export default function App() {
  const currentDate = new Date();
  const [pageDate, setPageDate] = useState(currentDate);
  const [token, setToken] = useState<string | null>(
    SecureStore.getItem(AUTH_TOKEN)
  );

  const {
    data: userData,
    loading: userMeLoading,
    error: userMeError,
    refetch: refetchUserData,
  } = useQuery(GET_USER_ME, {
    skip: !token,
    // onCompleted: (data) => {
    //   if (data?.me) {
    //     // Identify user in Mixpanel
    //     analytics.identify(data.me.id);
    //     analytics.setUserProperties({
    //       $email: data.me.email,
    //       currency: data.me.currency || "USD",
    //       // Add any other user properties here
    //     });
    //   }
    // },
  });

  if (userMeLoading) {
    return null;
  }

  if (userMeError?.networkError) {
    const serverError = userMeError?.networkError as ServerError;
    const errorMessage = serverError.result;

    if (errorMessage?.includes("invalid token")) {
      handleLogout();
    }
  }

  if (token && !SecureStore.getItem(AUTH_TOKEN_USER)) {
    handleLogout();
  }

  const onClickNext = () => {
    const nextDate = new Date(
      pageDate.getFullYear(),
      pageDate.getMonth() + 1,
      pageDate.getDate()
    );
    setPageDate(nextDate);
  };

  const onClickPrevious = () => {
    const previousDate = new Date(
      pageDate.getFullYear(),
      pageDate.getMonth() - 1,
      pageDate.getDate()
    );
    setPageDate(previousDate);
  };

  console.log({ userData });

  if (!token) {
    return <LoginPageContainer setToken={setToken} />;
  }

  return (
    <View style={{ padding: 36 }}>
      <Text>Hi ! {userData?.me?.email}</Text>
      <Pressable onPress={() => handleLogout()}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
}
