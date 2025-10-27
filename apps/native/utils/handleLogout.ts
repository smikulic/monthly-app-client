import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { AUTH_TOKEN, AUTH_TOKEN_USER } from "@/constants";

export const handleLogout = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync(AUTH_TOKEN),
    SecureStore.deleteItemAsync(AUTH_TOKEN_USER),
  ]);

  router.replace("/");
};
