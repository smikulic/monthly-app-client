import { gql } from "@apollo/client";

export const GET_INVESTMENTS_LIST = gql`
  query InvestmentsList {
    investments {
      id
      createdAt
      updatedAt
      name
      quantity
      amount
      currency
      startDate
      initialAmount
    }
  }
`;

export const CREATE_INVESTMENT_MUTATION = gql`
  mutation CreateInvestment($input: CreateInvestmentInput!) {
    createInvestment(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_INVESTMENT_MUTATION = gql`
  mutation UpdateInvestment($input: UpdateInvestmentInput!) {
    updateInvestment(input: $input) {
      id
      name
    }
  }
`;

export const DELETE_INVESTMENT_MUTATION = gql`
  mutation DeleteInvestment($id: ID!) {
    deleteInvestment(id: $id)
  }
`;