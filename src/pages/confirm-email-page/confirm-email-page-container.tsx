// src/components/confirm-email/ConfirmEmailPageContainer.tsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { AUTH_TOKEN, AUTH_TOKEN_USER } from "../../constants";

const CONFIRM_EMAIL_MUTATION = gql`
  mutation ConfirmEmail($token: String!) {
    confirmEmail(token: $token) {
      token
      user {
        email
      }
    }
  }
`;

export const ConfirmEmailPageContainer: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get("token") || "";

  const [confirmEmail, { loading }] = useMutation(CONFIRM_EMAIL_MUTATION, {
    variables: { token },
    onError(err) {
      toast.error(err.message);
      navigate("/"); // back to home or login
    },
    onCompleted({ confirmEmail }) {
      // store your real JWT + email and go home
      localStorage.setItem(AUTH_TOKEN, confirmEmail.token!);
      localStorage.setItem(AUTH_TOKEN_USER, confirmEmail.user.email!);
      toast.success("Your email has been confirmed!");
      navigate("/");
    },
  });

  useEffect(() => {
    if (token) confirmEmail();
  }, [token]);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      {loading ? (
        <p>Confirming your email…</p>
      ) : (
        <p>If you’re not redirected automatically, click below:</p>
      )}
      {!loading && (
        <button onClick={() => confirmEmail()} disabled={loading}>
          Confirm Email
        </button>
      )}
    </div>
  );
};
