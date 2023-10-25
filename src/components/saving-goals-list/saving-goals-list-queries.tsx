import { gql } from "@apollo/client";

export const GET_SAVING_GOALS_LIST = gql`
  query SavingGoalsList {
    savingGoals {
      id
      createdAt
      name
      goalDate
      goalAmount
      initialSaveAmount
    }
  }
`;

export const CREATE_SAVING_GOAL_MUTATION = gql`
  mutation CreateSavingGoal(
    $name: String!
    $goalDate: String!
    $goalAmount: Int!
    $initialSaveAmount: Int
  ) {
    createSavingGoal(
      name: $name
      goalDate: $goalDate
      goalAmount: $goalAmount
      initialSaveAmount: $initialSaveAmount
    ) {
      name
    }
  }
`;
export const UPDATE_SAVING_GOAL_MUTATION = gql`
  mutation UpdateSavingGoal(
    $id: ID!
    $name: String!
    $goalDate: String!
    $goalAmount: Int!
    $initialSaveAmount: Int
  ) {
    updateSavingGoal(
      id: $id
      name: $name
      goalDate: $goalDate
      goalAmount: $goalAmount
      initialSaveAmount: $initialSaveAmount
    ) {
      name
    }
  }
`;
export const DELETE_SAVING_GOAL_MUTATION = gql`
  mutation DeleteSavingGoal($id: ID!) {
    deleteSavingGoal(id: $id) {
      name
    }
  }
`;
