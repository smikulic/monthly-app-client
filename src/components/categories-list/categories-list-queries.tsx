import { gql } from "@apollo/client";

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) {
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
  ) {
    createSubcategory(
      categoryId: $categoryId
      name: $name
      budgetAmount: $budgetAmount
    ) {
      name
      budgetAmount
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
