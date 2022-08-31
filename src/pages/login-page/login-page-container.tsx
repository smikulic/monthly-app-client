import { gql } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export const LoginPageContainer = () => {
  const navigate = useNavigate();
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
    onCompleted: ({ login }) => {
      localStorage.setItem(AUTH_TOKEN, login?.token!);
      localStorage.setItem(AUTH_TOKEN_USER, login?.user?.email!);
      navigate("/");
    },
  });

  const [signupAction]: any = useSignupMutation({
    variables: {
      email: formState.email,
      password: formState.password,
    },
    onCompleted: ({ signup }) => {
      localStorage.setItem(AUTH_TOKEN, signup?.token!);
      localStorage.setItem(AUTH_TOKEN_USER, signup?.user?.email!);
      navigate("/");
    },
  });

  // const [login]: any = useMutation(LOGIN_MUTATION, {
  //   variables: {
  //     email: formState.email,
  //     password: formState.password,
  //   },
  //   onCompleted: ({ login }) => {
  //     localStorage.setItem(AUTH_TOKEN, login.token);
  //     navigate("/");
  //   },
  // });

  // const [signup]: any = useMutation(SIGNUP_MUTATION, {
  //   variables: {
  //     email: formState.email,
  //     password: formState.password,
  //   },
  //   onCompleted: ({ signup }) => {
  //     localStorage.setItem(AUTH_TOKEN, signup.token);
  //     navigate("/");
  //   },
  // });

  return (
    <div className="loginPage">
      <h4 className="mv3">{formState.login ? "Login" : "Sign Up"}</h4>
      <div className="flex flex-column">
        <input
          value={formState.email}
          onChange={(e) =>
            setFormState({
              ...formState,
              email: e.target.value,
            })
          }
          type="text"
          placeholder="Your email address"
        />
        <input
          value={formState.password}
          onChange={(e) =>
            setFormState({
              ...formState,
              password: e.target.value,
            })
          }
          type="password"
          placeholder="Choose a safe password"
        />
      </div>
      <div className="flex mt3">
        <button
          className="pointer mr2 button"
          onClick={formState.login ? loginAction : signupAction}
        >
          {formState.login ? "login" : "create account"}
        </button>
        <button
          className="pointer button"
          onClick={(e) =>
            setFormState({
              ...formState,
              login: !formState.login,
            })
          }
        >
          {formState.login
            ? "need to create an account?"
            : "already have an account?"}
        </button>
      </div>
    </div>
  );
};
