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

export const GET_ALL_EXPENSES = gql`
  query Expenses {
    expenses {
      id
      subcategoryId
      amount
      description
      date
    }
  }
`;

export const GET_EXPENSES_LIST = gql`
  query ExpensesList($date: String!) {
    expenses(filter: { date: $date }) {
      id
      subcategoryId
      amount
      description
      date
    }
  }
`;

export const GET_CHART_EXPENSES_LIST = gql`
  query ChartExpensesList($date: String!) {
    chartExpenses(filter: { date: $date }) {
      monthlyTotals
      categoryExpenseTotals {
        categoryName
        subcategoryName
        total
      }
    }
  }
`;

export const CREATE_EXPENSE_MUTATION = gql`
  mutation CreateExpense(
    $subcategoryId: ID!
    $amount: Int!
    $description: String
    $date: String!
  ) {
    createExpense(
      subcategoryId: $subcategoryId
      amount: $amount
      description: $description
      date: $date
    ) {
      id
      amount
      description
      date
    }
  }
`;
export const UPDATE_EXPENSE_MUTATION = gql`
  mutation UpdateExpense(
    $id: ID!
    $subcategoryId: ID!
    $amount: Int!
    $description: String
    $date: String!
  ) {
    updateExpense(
      id: $id
      subcategoryId: $subcategoryId
      amount: $amount
      description: $description
      date: $date
    ) {
      id
      amount
      description
      date
    }
  }
`;
export const DELETE_EXPENSE_MUTATION = gql`
  mutation DeleteExpense($id: ID!) {
    deleteExpense(id: $id) {
      id
    }
  }
`;
