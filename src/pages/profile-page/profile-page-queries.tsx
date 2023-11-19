import { gql } from "@apollo/client";

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $currency: String!) {
    updateUser(id: $id, currency: $currency) {
      email
      currency
    }
  }
`;
