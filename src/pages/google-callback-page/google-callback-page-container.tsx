import { useEffect, Dispatch, SetStateAction } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { gql } from "@apollo/client";
import { AUTH_TOKEN, AUTH_TOKEN_USER } from "../../constants";
import { useGoogleLoginMutation } from "../../generated/graphql";
import { analytics } from "../../utils/mixpanel";

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

export const GoogleCallbackPageContainer = ({
  setToken,
}: {
  setToken: Dispatch<SetStateAction<string | null>>;
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [googleLoginAction] = useGoogleLoginMutation({
    onError: (error) => {
      console.error("Google auth error:", error);
      toast.error("Failed to authenticate with Google. Please try again.");
      navigate("/login");
    },
    onCompleted: ({ googleLogin }) => {
      if (googleLogin?.token && googleLogin?.user) {
        // Track user login via Google
        analytics.trackUserLogin(googleLogin.user.email!);
        analytics.identify(googleLogin.user.id!);
        analytics.setUserProperties({
          $email: googleLogin.user.email!,
        });

        // Store auth data
        localStorage.setItem(AUTH_TOKEN, googleLogin.token);
        localStorage.setItem(AUTH_TOKEN_USER, googleLogin.user.email!);
        setToken(googleLogin.token);
        window.location.replace("/");
      } else {
        toast.error("Invalid response from server");
        navigate("/login");
      }
    },
  });

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      toast.error("Google authentication was cancelled or failed");
      navigate("/login");
      return;
    }

    if (code) {
      // Exchange the authorization code for tokens
      googleLoginAction({
        variables: { code },
      });
    } else {
      toast.error("No authorization code received");
      navigate("/login");
    }
  }, [searchParams, navigate, googleLoginAction]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "48px",
      }}
    >
      <h2>Authenticating with Google...</h2>
      <p>Please wait while we complete your sign in.</p>
    </div>
  );
};
