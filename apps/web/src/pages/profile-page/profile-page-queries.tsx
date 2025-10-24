import { gql } from "@apollo/client";

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $currency: String!, $weeklyReminder: Boolean!) {
    updateUser(id: $id, currency: $currency, weeklyReminder: $weeklyReminder) {
      email
      currency
      weeklyReminder
    }
  }
`;

export const DELETE_ACCOUNT_MUTATION = gql`
  mutation DeleteAccount {
    deleteAccount
  }
`;
