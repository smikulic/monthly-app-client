import { gql } from "@apollo/client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { AUTH_TOKEN, AUTH_TOKEN_USER } from "../../constants";
import { useLoginMutation, useSignupMutation } from "../../generated/graphql";
import "./login-page-container.css";

export const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      token
      user {
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
        email
      }
    }
  }
`;

export const LoginPageContainer = ({
  setAuthenticated,
}: {
  setAuthenticated: Dispatch<SetStateAction<string | null>>;
}) => {
  const [formState, setFormState] = useState({
    login: true,
    email: "",
    password: "",
  });

  const [loginAction]: any = useLoginMutation({
    variables: {
      email: formState.email,
      password: formState.password,
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onCompleted: ({ login }) => {
      localStorage.setItem(AUTH_TOKEN, login?.token!);
      localStorage.setItem(AUTH_TOKEN_USER, login?.user?.email!);
      setAuthenticated(login?.token!);
      window.location.replace("/");
    },
  });

  const [signupAction]: any = useSignupMutation({
    variables: {
      email: formState.email,
      password: formState.password,
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onCompleted: ({ signup }) => {
      localStorage.setItem(AUTH_TOKEN, signup?.token!);
      localStorage.setItem(AUTH_TOKEN_USER, signup?.user?.email!);
      console.log("REGISTER");
      window.location.replace("/");
    },
  });

  return (
    <div className="loginPage">
      <h1 className="title">{formState.login ? "Login" : "Sign Up"}</h1>
      <div className="form">
        <div className="formField">
          <label>Email address</label>
          <input
            value={formState.email}
            onChange={(e) =>
              setFormState({
                ...formState,
                email: e.target.value,
              })
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
              setFormState({
                ...formState,
                password: e.target.value,
              })
            }
            type="password"
            placeholder={
              formState.login ? "Enter your password" : "Choose a safe password"
            }
          />
        </div>
        <div className="actions">
          <button
            onClick={
              formState.login
                ? () => {
                    loginAction();
                  }
                : signupAction
            }
          >
            {formState.login ? "Login" : "Register"}
          </button>
          <p
            onClick={(e) =>
              setFormState({
                ...formState,
                login: !formState.login,
              })
            }
          >
            {formState.login && (
              <>
                need to create an account? register{" "}
                <span className="link">here</span>
              </>
            )}
            {!formState.login && (
              <>
                already have an account? login{" "}
                <span className="link">here</span>
              </>
            )}
            {/* {formState.login
              ? "need to create an account? register here"
              : "already have an account? login here"} */}
          </p>
        </div>
      </div>
    </div>
  );
};
