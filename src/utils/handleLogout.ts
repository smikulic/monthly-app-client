import { AUTH_TOKEN, AUTH_TOKEN_USER } from "../constants";

export const handleLogout = () => {
  localStorage.removeItem(AUTH_TOKEN);
  localStorage.removeItem(AUTH_TOKEN_USER);
  window.location.replace("/app");
};
