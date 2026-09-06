import { gql } from "@apollo/client";

export const GET_CATEGORIES_LIST = gql`
  query CategoriesList($scope: ScopeMode, $groupId: ID) {
    categories(scope: $scope, groupId: $groupId) {
      id
      name
      groupId
      user {
        id
      }
      subcategories {
        id
        categoryId
        createdAt
        rolloverDate
        name
        budgetAmount
        budgets {
          id
          amount
          validFrom
        }
      }
    }
  }
`;

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) {
      id
      name
    }
  }
`;
export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: ID!, $name: String!) {
    updateCategory(id: $id, name: $name) {
      id
      name
    }
  }
`;
export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      name
    }
  }
`;

export const CREATE_SUBCATEGORY_MUTATION = gql`
  mutation CreateSubcategory(
    $categoryId: ID!
    $name: String!
    $budgetAmount: Int!
    $rolloverDate: String!
  ) {
    createSubcategory(
      categoryId: $categoryId
      name: $name
      budgetAmount: $budgetAmount
      rolloverDate: $rolloverDate
    ) {
      id
      categoryId
      name
      budgetAmount
    }
  }
`;
export const UPDATE_SUBCATEGORY_MUTATION = gql`
  mutation UpdateSubcategory(
    $id: ID!
    $categoryId: ID!
    $name: String!
    $budgetAmount: Int
    $rolloverDate: String
  ) {
    updateSubcategory(
      id: $id
      categoryId: $categoryId
      name: $name
      budgetAmount: $budgetAmount
      rolloverDate: $rolloverDate
    ) {
      id
      categoryId
      name
      budgetAmount
    }
  }
`;
export const SET_SUBCATEGORY_BUDGET_MUTATION = gql`
  mutation SetSubcategoryBudget(
    $subcategoryId: ID!
    $amount: Int!
    $validFrom: String!
  ) {
    setSubcategoryBudget(
      subcategoryId: $subcategoryId
      amount: $amount
      validFrom: $validFrom
    ) {
      id
      budgetAmount
      rolloverDate
      budgets {
        id
        amount
        validFrom
      }
    }
  }
`;
export const DELETE_SUBCATEGORY_BUDGET_MUTATION = gql`
  mutation DeleteSubcategoryBudget($subcategoryId: ID!, $validFrom: String!) {
    deleteSubcategoryBudget(
      subcategoryId: $subcategoryId
      validFrom: $validFrom
    ) {
      id
      budgetAmount
      rolloverDate
      budgets {
        id
        amount
        validFrom
      }
    }
  }
`;
export const DELETE_SUBCATEGORY_MUTATION = gql`
  mutation DeleteSubcategory($id: ID!) {
    deleteSubcategory(id: $id) {
      name
    }
  }
`;
