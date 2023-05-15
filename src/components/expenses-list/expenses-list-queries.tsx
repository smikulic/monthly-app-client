import { gql } from "@apollo/client";

export const GET_CATEGORY = gql`
  query Category($id: ID!, $date: String!) {
    category(id: $id) {
      id
      name
      subcategories {
        id
        name
        budgetAmount
        expenses(filter: { date: $date }) {
          id
          amount
          date
        }
      }
    }
  }
`;

export const CREATE_EXPENSE_MUTATION = gql`
  mutation CreateExpense($subcategoryId: ID!, $amount: Int!, $date: String!) {
    createExpense(subcategoryId: $subcategoryId, amount: $amount, date: $date) {
      id
      amount
      date
    }
  }
`;
