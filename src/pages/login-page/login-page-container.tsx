import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { gql } from "@apollo/client";
import { AUTH_TOKEN, AUTH_TOKEN_USER } from "../../constants";
import {
  useLoginMutation,
  useResetPasswordRequestMutation,
  useSignupMutation,
  useGoogleAuthUrlQuery,
} from "../../generated/graphql";
import { analytics } from "../../utils/mixpanel";
import "./login-page-container.css";

export const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
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

export const RESET_PASSWORD_REQUEST_MUTATION = gql`
  mutation ResetPasswordRequest($email: String!) {
    resetPasswordRequest(email: $email) {
      email
    }
  }
`;

export const LoginPageContainer = ({
  setToken,
}: {
  setToken: Dispatch<SetStateAction<string | null>>;
}) => {
  const [formState, setFormState] = useState({
    login: true,
    passwordReset: false,
    email: "",
    password: "",
  });

  const [loginAction] = useLoginMutation({
    variables: {
      email: formState.email,
      password: formState.password,
    },
    onError: (error) => {
      // toast.error(error.message);
      if (
        error.message?.includes("confirm your email") ||
        error.message?.includes("Email not confirmed")
      ) {
        toast.error("Please confirm your email first. Check your inbox.");
      } else {
        toast.error(error.message);
      }
    },
    onCompleted: ({ login }) => {
      // Track user login
      analytics.trackUserLogin(login?.user?.email!);
      analytics.identify(login?.user?.id!);
      analytics.setUserProperties({
        $email: login?.user?.email!,
      });

      localStorage.setItem(AUTH_TOKEN, login?.token!);
      localStorage.setItem(AUTH_TOKEN_USER, login?.user?.email!);
      setToken(login?.token!);
      window.location.replace("/");
    },
  });

  const [signupAction] = useSignupMutation({
    variables: {
      email: formState.email,
      password: formState.password,
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onCompleted: ({ signup }) => {
      console.log({ signup });
      // Track user signup
      analytics.trackUserSignup(formState.email);
      toast.success("Email with confirmation instructions is sent!");
    },
  });

  const [resetPasswordRequestAction] = useResetPasswordRequestMutation({
    variables: {
      email: formState.email,
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onCompleted: ({ resetPasswordRequest }) => {
      console.log({ resetPasswordRequest });
      toast.success("Email with reset password instructions is sent!");
    },
  });

  const { data: googleAuthUrlData } = useGoogleAuthUrlQuery();

  const handleGoogleLogin = () => {
    if (googleAuthUrlData?.googleAuthUrl?.url) {
      window.location.href = googleAuthUrlData.googleAuthUrl.url;
    } else {
      toast.error("Google authentication is not available right now");
    }
  };

  return (
    <div className="loginPage">
      {!formState.passwordReset && (
        <>
          <h1 className="title">{formState.login ? "Login" : "Sign Up"}</h1>
          <div className="form">
            <div className="formField">
              <label>Email address</label>
              <input
                value={formState.email}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
                type="text"
                placeholder="Enter your email"
              />
            </div>
            <div className="formField">
              <label>Password</label>
              <input
                value={formState.password}
                onChange={(e) =>
                  setFormState({ ...formState, password: e.target.value })
                }
                type="password"
                placeholder={
                  formState.login
                    ? "Enter your password"
                    : "Choose a safe password"
                }
              />
            </div>
            <div className="actions">
              <button
                onClick={
                  formState.login ? () => loginAction() : () => signupAction()
                }
              >
                {formState.login ? "Login" : "Register"}
              </button>

              <div className="divider">
                <span>OR</span>
              </div>

              <button
                className="google-signin-button"
                onClick={handleGoogleLogin}
                type="button"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  style={{ marginRight: "8px" }}
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {formState.login
                  ? "Sign in with Google"
                  : "Sign up with Google"}
              </button>

              <br />
              {formState.login && (
                <div
                  onClick={(e) => setFormState({ ...formState, login: false })}
                >
                  need to create an account? register{" "}
                  <span className="link">here</span>
                </div>
              )}
              {!formState.login && (
                <div
                  onClick={(e) => setFormState({ ...formState, login: true })}
                >
                  already have an account? login{" "}
                  <span className="link">here</span>
                </div>
              )}

              <br />
              <div>
                Forgot your password? reset{" "}
                <span
                  className="link"
                  onClick={() =>
                    setFormState({ ...formState, passwordReset: true })
                  }
                >
                  here
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {formState.passwordReset && (
        <>
          <h1 className="title">Forgot Your Password?</h1>
          <div className="form">
            <div className="formField">
              <label>Email address</label>
              <input
                value={formState.email}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
                type="text"
                placeholder="Enter your email"
              />
            </div>
            <div className="actions">
              <button onClick={() => resetPasswordRequestAction()}>
                Send reset instructions
              </button>

              <br />
              <div
                onClick={(e) =>
                  setFormState({
                    ...formState,
                    login: true,
                    passwordReset: false,
                  })
                }
              >
                back to <span className="link">Login page</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
