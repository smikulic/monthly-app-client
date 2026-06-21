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
  query ExpensesList($date: String!, $scope: ScopeMode, $groupId: ID) {
    expenses(filter: { date: $date }, scope: $scope, groupId: $groupId) {
      id
      subcategoryId
      amount
      description
      date
      paidBy {
        id
      }
    }
  }
`;

export const GET_CHART_EXPENSES_LIST = gql`
  query ChartExpensesList($date: String!, $scope: ScopeMode, $groupId: ID) {
    chartExpenses(filter: { date: $date }, scope: $scope, groupId: $groupId) {
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
    $paidByUserId: ID
  ) {
    createExpense(
      subcategoryId: $subcategoryId
      amount: $amount
      description: $description
      date: $date
      paidByUserId: $paidByUserId
    ) {
      id
      amount
      description
      date
      paidBy {
        id
      }
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
    $paidByUserId: ID
  ) {
    updateExpense(
      id: $id
      subcategoryId: $subcategoryId
      amount: $amount
      description: $description
      date: $date
      paidByUserId: $paidByUserId
    ) {
      id
      amount
      description
      date
      paidBy {
        id
      }
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
