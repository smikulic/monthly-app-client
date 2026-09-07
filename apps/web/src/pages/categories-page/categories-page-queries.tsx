import { gql } from "@apollo/client";

export const GET_CATEGORIES_LIST = gql`
  query CategoriesList($scope: ScopeMode, $groupId: ID, $date: String!) {
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
        name
        budgetAmount
        # Both worked out server-side for the month being viewed, so nothing
        # here has to know how the schedule accrues.
        budgetForMonth(date: $date)
        rolloverRemaining(date: $date)
        # Only the schedule editor reads these.
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
    $validFrom: String!
  ) {
    createSubcategory(
      categoryId: $categoryId
      name: $name
      budgetAmount: $budgetAmount
      validFrom: $validFrom
    ) {
      id
      categoryId
      name
      budgetAmount
    }
  }
`;
export const UPDATE_SUBCATEGORY_MUTATION = gql`
  mutation UpdateSubcategory($id: ID!, $categoryId: ID!, $name: String!) {
    updateSubcategory(id: $id, categoryId: $categoryId, name: $name) {
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
