import { gql } from "@apollo/client";

export const GET_CATEGORY = gql`
  query Category($id: ID!) {
    category(id: $id) {
      id
      name
      subcategories {
        id
        name
        budgetAmount
      }
    }
  }
`;
