import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { gql } from "@apollo/client";
import { AUTH_TOKEN, AUTH_TOKEN_USER } from "../../constants";
import {
  useLoginMutation,
  useResetPasswordRequestMutation,
  useSignupMutation,
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
      }
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
    // onCompleted: ({ signup }) => {
    //   localStorage.setItem(AUTH_TOKEN, signup?.token!);
    //   localStorage.setItem(AUTH_TOKEN_USER, signup?.user?.email!);
    //   console.log("REGISTER");
    //   window.location.replace("/");
    // },
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
