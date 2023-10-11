import { gql } from "@apollo/client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useResetPasswordMutation } from "../../generated/graphql";
import "../login-page/login-page-container.css";
import { useParamsQuery } from "../../hooks/useParamsQuery";

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      email
    }
  }
`;

export const ResetPasswordPageContainer = () => {
  const query = useParamsQuery();

  const [formState, setFormState] = useState({
    password: "",
  });

  const [resetPasswordAction]: any = useResetPasswordMutation({
    variables: {
      token: query.get("resetToken") || "",
      password: formState.password,
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onCompleted: ({ resetPassword }) => {
      console.log({ resetPassword });
      toast.success("You have successfully reset your password!");
    },
  });

  return (
    <div className="loginPage">
      <h1 className="title">Reset password</h1>
      <div className="form">
        <div className="formField">
          <label>Password</label>
          <input
            value={formState.password}
            onChange={(e) =>
              setFormState({ ...formState, password: e.target.value })
            }
            type="password"
            placeholder="Enter your password"
          />
        </div>
        <div className="actions">
          <button onClick={resetPasswordAction}>Reset</button>

          <br />
          <div onClick={() => window.location.replace("/app")}>
            then return back to <span className="link">Login page</span>
          </div>
        </div>
      </div>
    </div>
  );
};
