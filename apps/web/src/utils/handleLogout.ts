import { AUTH_TOKEN, AUTH_TOKEN_USER } from "@/constants";
import { analytics } from "./analytics";

export const handleLogout = () => {
  analytics.trackUserLogout();
  analytics.reset();
  localStorage.removeItem(AUTH_TOKEN);
  localStorage.removeItem(AUTH_TOKEN_USER);
  window.location.replace("/");
};
