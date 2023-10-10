import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type Category = {
  __typename?: 'Category';
  icon?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  subcategories?: Maybe<Array<Maybe<Subcategory>>>;
  user?: Maybe<User>;
};

export type Expense = {
  __typename?: 'Expense';
  amount: Scalars['Int'];
  date: Scalars['String'];
  id: Scalars['ID'];
  subcategoryId: Scalars['ID'];
};

export type ExpenseFilterInput = {
  date: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategory: Category;
  createExpense: Expense;
  createSubcategory: Subcategory;
  deleteCategory: Category;
  deleteExpense: Expense;
  deleteSubcategory: Subcategory;
  login?: Maybe<AuthPayload>;
  resetPassword: User;
  resetPasswordRequest: PasswordResetRequestPayload;
  signup?: Maybe<AuthPayload>;
  updateCategory: Category;
  updateExpense: Expense;
  updateSubcategory: Subcategory;
};


export type MutationCreateCategoryArgs = {
  icon?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};


export type MutationCreateExpenseArgs = {
  amount: Scalars['Int'];
  date: Scalars['String'];
  subcategoryId: Scalars['ID'];
};


export type MutationCreateSubcategoryArgs = {
  budgetAmount: Scalars['Int'];
  categoryId: Scalars['ID'];
  icon?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteExpenseArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSubcategoryArgs = {
  id: Scalars['ID'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  password: Scalars['String'];
  token: Scalars['String'];
};


export type MutationResetPasswordRequestArgs = {
  email: Scalars['String'];
};


export type MutationSignupArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUpdateCategoryArgs = {
  icon?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationUpdateExpenseArgs = {
  amount: Scalars['Int'];
  date: Scalars['String'];
  id: Scalars['ID'];
  subcategoryId: Scalars['ID'];
};


export type MutationUpdateSubcategoryArgs = {
  budgetAmount: Scalars['Int'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type PasswordResetRequestPayload = {
  __typename?: 'PasswordResetRequestPayload';
  email: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  categories: Array<Category>;
  category: Category;
  chartExpenses: Array<Scalars['Int']>;
  expenses: Array<Expense>;
  me: User;
  subcategories: Array<Subcategory>;
  subcategory: Subcategory;
  user: User;
  users: Array<User>;
};


export type QueryCategoryArgs = {
  id: Scalars['ID'];
};


export type QueryChartExpensesArgs = {
  filter?: InputMaybe<ExpenseFilterInput>;
};


export type QueryExpensesArgs = {
  filter?: InputMaybe<ExpenseFilterInput>;
};


export type QuerySubcategoryArgs = {
  id: Scalars['ID'];
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type Subcategory = {
  __typename?: 'Subcategory';
  budgetAmount?: Maybe<Scalars['Int']>;
  createdAt: Scalars['String'];
  expenses?: Maybe<Array<Maybe<Expense>>>;
  icon?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
};


export type SubcategoryExpensesArgs = {
  filter?: InputMaybe<ExpenseFilterInput>;
};

export type User = {
  __typename?: 'User';
  categories?: Maybe<Array<Maybe<Category>>>;
  currency?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  emailConfirmed?: Maybe<Scalars['Boolean']>;
  expenses?: Maybe<Array<Maybe<Expense>>>;
  id: Scalars['ID'];
  password: Scalars['String'];
};

export type CategoriesListQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesListQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, name: string, subcategories?: Array<{ __typename?: 'Subcategory', id: string, createdAt: string, name: string, budgetAmount?: number | null } | null> | null }> };

export type CreateCategoryMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'Category', name: string } };

export type UpdateCategoryMutationVariables = Exact<{
  id: Scalars['ID'];
  name: Scalars['String'];
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'Category', name: string } };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: { __typename?: 'Category', name: string } };

export type CreateSubcategoryMutationVariables = Exact<{
  categoryId: Scalars['ID'];
  name: Scalars['String'];
  budgetAmount: Scalars['Int'];
}>;


export type CreateSubcategoryMutation = { __typename?: 'Mutation', createSubcategory: { __typename?: 'Subcategory', name: string, budgetAmount?: number | null } };

export type UpdateSubcategoryMutationVariables = Exact<{
  id: Scalars['ID'];
  name: Scalars['String'];
  budgetAmount: Scalars['Int'];
}>;


export type UpdateSubcategoryMutation = { __typename?: 'Mutation', updateSubcategory: { __typename?: 'Subcategory', name: string, budgetAmount?: number | null } };

export type DeleteSubcategoryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteSubcategoryMutation = { __typename?: 'Mutation', deleteSubcategory: { __typename?: 'Subcategory', name: string } };

export type CategoryQueryVariables = Exact<{
  id: Scalars['ID'];
  date: Scalars['String'];
}>;


export type CategoryQuery = { __typename?: 'Query', category: { __typename?: 'Category', id: string, name: string, subcategories?: Array<{ __typename?: 'Subcategory', id: string, name: string, budgetAmount?: number | null, expenses?: Array<{ __typename?: 'Expense', id: string, amount: number, date: string } | null> | null } | null> | null } };

export type ExpensesListQueryVariables = Exact<{
  date: Scalars['String'];
}>;


export type ExpensesListQuery = { __typename?: 'Query', expenses: Array<{ __typename?: 'Expense', id: string, subcategoryId: string, amount: number, date: string }> };

export type ChartExpensesListQueryVariables = Exact<{
  date: Scalars['String'];
}>;


export type ChartExpensesListQuery = { __typename?: 'Query', chartExpenses: Array<number> };

export type CreateExpenseMutationVariables = Exact<{
  subcategoryId: Scalars['ID'];
  amount: Scalars['Int'];
  date: Scalars['String'];
}>;


export type CreateExpenseMutation = { __typename?: 'Mutation', createExpense: { __typename?: 'Expense', id: string, amount: number, date: string } };

export type UpdateExpenseMutationVariables = Exact<{
  id: Scalars['ID'];
  subcategoryId: Scalars['ID'];
  amount: Scalars['Int'];
  date: Scalars['String'];
}>;


export type UpdateExpenseMutation = { __typename?: 'Mutation', updateExpense: { __typename?: 'Expense', id: string, amount: number, date: string } };

export type DeleteExpenseMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteExpenseMutation = { __typename?: 'Mutation', deleteExpense: { __typename?: 'Expense', id: string } };

export type SignupMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignupMutation = { __typename?: 'Mutation', signup?: { __typename?: 'AuthPayload', token?: string | null, user?: { __typename?: 'User', email: string } | null } | null };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'AuthPayload', token?: string | null, user?: { __typename?: 'User', email: string } | null } | null };

export type ResetPasswordRequestMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ResetPasswordRequestMutation = { __typename?: 'Mutation', resetPasswordRequest: { __typename?: 'PasswordResetRequestPayload', email: string } };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'User', email: string } };


export const CategoriesListDocument = gql`
    query CategoriesList {
  categories {
    id
    name
    subcategories {
      id
      createdAt
      name
      budgetAmount
    }
  }
}
    `;

/**
 * __useCategoriesListQuery__
 *
 * To run a query within a React component, call `useCategoriesListQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoriesListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoriesListQuery({
 *   variables: {
 *   },
 * });
 */
export function useCategoriesListQuery(baseOptions?: Apollo.QueryHookOptions<CategoriesListQuery, CategoriesListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoriesListQuery, CategoriesListQueryVariables>(CategoriesListDocument, options);
      }
export function useCategoriesListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoriesListQuery, CategoriesListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoriesListQuery, CategoriesListQueryVariables>(CategoriesListDocument, options);
        }
export type CategoriesListQueryHookResult = ReturnType<typeof useCategoriesListQuery>;
export type CategoriesListLazyQueryHookResult = ReturnType<typeof useCategoriesListLazyQuery>;
export type CategoriesListQueryResult = Apollo.QueryResult<CategoriesListQuery, CategoriesListQueryVariables>;
export const CreateCategoryDocument = gql`
    mutation CreateCategory($name: String!) {
  createCategory(name: $name) {
    name
  }
}
    `;
export type CreateCategoryMutationFn = Apollo.MutationFunction<CreateCategoryMutation, CreateCategoryMutationVariables>;

/**
 * __useCreateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCategoryMutation, { data, loading, error }] = useCreateCategoryMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, options);
      }
export type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
export type CreateCategoryMutationResult = Apollo.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = gql`
    mutation UpdateCategory($id: ID!, $name: String!) {
  updateCategory(id: $id, name: $name) {
    name
  }
}
    `;
export type UpdateCategoryMutationFn = Apollo.MutationFunction<UpdateCategoryMutation, UpdateCategoryMutationVariables>;

/**
 * __useUpdateCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCategoryMutation, { data, loading, error }] = useUpdateCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UpdateCategoryDocument, options);
      }
export type UpdateCategoryMutationHookResult = ReturnType<typeof useUpdateCategoryMutation>;
export type UpdateCategoryMutationResult = Apollo.MutationResult<UpdateCategoryMutation>;
export type UpdateCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const DeleteCategoryDocument = gql`
    mutation DeleteCategory($id: ID!) {
  deleteCategory(id: $id) {
    name
  }
}
    `;
export type DeleteCategoryMutationFn = Apollo.MutationFunction<DeleteCategoryMutation, DeleteCategoryMutationVariables>;

/**
 * __useDeleteCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCategoryMutation, { data, loading, error }] = useDeleteCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCategoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DeleteCategoryDocument, options);
      }
export type DeleteCategoryMutationHookResult = ReturnType<typeof useDeleteCategoryMutation>;
export type DeleteCategoryMutationResult = Apollo.MutationResult<DeleteCategoryMutation>;
export type DeleteCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const CreateSubcategoryDocument = gql`
    mutation CreateSubcategory($categoryId: ID!, $name: String!, $budgetAmount: Int!) {
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
export type CreateSubcategoryMutationFn = Apollo.MutationFunction<CreateSubcategoryMutation, CreateSubcategoryMutationVariables>;

/**
 * __useCreateSubcategoryMutation__
 *
 * To run a mutation, you first call `useCreateSubcategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSubcategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSubcategoryMutation, { data, loading, error }] = useCreateSubcategoryMutation({
 *   variables: {
 *      categoryId: // value for 'categoryId'
 *      name: // value for 'name'
 *      budgetAmount: // value for 'budgetAmount'
 *   },
 * });
 */
export function useCreateSubcategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateSubcategoryMutation, CreateSubcategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSubcategoryMutation, CreateSubcategoryMutationVariables>(CreateSubcategoryDocument, options);
      }
export type CreateSubcategoryMutationHookResult = ReturnType<typeof useCreateSubcategoryMutation>;
export type CreateSubcategoryMutationResult = Apollo.MutationResult<CreateSubcategoryMutation>;
export type CreateSubcategoryMutationOptions = Apollo.BaseMutationOptions<CreateSubcategoryMutation, CreateSubcategoryMutationVariables>;
export const UpdateSubcategoryDocument = gql`
    mutation UpdateSubcategory($id: ID!, $name: String!, $budgetAmount: Int!) {
  updateSubcategory(id: $id, name: $name, budgetAmount: $budgetAmount) {
    name
    budgetAmount
  }
}
    `;
export type UpdateSubcategoryMutationFn = Apollo.MutationFunction<UpdateSubcategoryMutation, UpdateSubcategoryMutationVariables>;

/**
 * __useUpdateSubcategoryMutation__
 *
 * To run a mutation, you first call `useUpdateSubcategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSubcategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSubcategoryMutation, { data, loading, error }] = useUpdateSubcategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      budgetAmount: // value for 'budgetAmount'
 *   },
 * });
 */
export function useUpdateSubcategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSubcategoryMutation, UpdateSubcategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSubcategoryMutation, UpdateSubcategoryMutationVariables>(UpdateSubcategoryDocument, options);
      }
export type UpdateSubcategoryMutationHookResult = ReturnType<typeof useUpdateSubcategoryMutation>;
export type UpdateSubcategoryMutationResult = Apollo.MutationResult<UpdateSubcategoryMutation>;
export type UpdateSubcategoryMutationOptions = Apollo.BaseMutationOptions<UpdateSubcategoryMutation, UpdateSubcategoryMutationVariables>;
export const DeleteSubcategoryDocument = gql`
    mutation DeleteSubcategory($id: ID!) {
  deleteSubcategory(id: $id) {
    name
  }
}
    `;
export type DeleteSubcategoryMutationFn = Apollo.MutationFunction<DeleteSubcategoryMutation, DeleteSubcategoryMutationVariables>;

/**
 * __useDeleteSubcategoryMutation__
 *
 * To run a mutation, you first call `useDeleteSubcategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSubcategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSubcategoryMutation, { data, loading, error }] = useDeleteSubcategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSubcategoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSubcategoryMutation, DeleteSubcategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSubcategoryMutation, DeleteSubcategoryMutationVariables>(DeleteSubcategoryDocument, options);
      }
export type DeleteSubcategoryMutationHookResult = ReturnType<typeof useDeleteSubcategoryMutation>;
export type DeleteSubcategoryMutationResult = Apollo.MutationResult<DeleteSubcategoryMutation>;
export type DeleteSubcategoryMutationOptions = Apollo.BaseMutationOptions<DeleteSubcategoryMutation, DeleteSubcategoryMutationVariables>;
export const CategoryDocument = gql`
    query Category($id: ID!, $date: String!) {
  category(id: $id) {
    id
    name
    subcategories {
      id
      name
      budgetAmount
      expenses(filter: {date: $date}) {
        id
        amount
        date
      }
    }
  }
}
    `;

/**
 * __useCategoryQuery__
 *
 * To run a query within a React component, call `useCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *      date: // value for 'date'
 *   },
 * });
 */
export function useCategoryQuery(baseOptions: Apollo.QueryHookOptions<CategoryQuery, CategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoryQuery, CategoryQueryVariables>(CategoryDocument, options);
      }
export function useCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoryQuery, CategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoryQuery, CategoryQueryVariables>(CategoryDocument, options);
        }
export type CategoryQueryHookResult = ReturnType<typeof useCategoryQuery>;
export type CategoryLazyQueryHookResult = ReturnType<typeof useCategoryLazyQuery>;
export type CategoryQueryResult = Apollo.QueryResult<CategoryQuery, CategoryQueryVariables>;
export const ExpensesListDocument = gql`
    query ExpensesList($date: String!) {
  expenses(filter: {date: $date}) {
    id
    subcategoryId
    amount
    date
  }
}
    `;

/**
 * __useExpensesListQuery__
 *
 * To run a query within a React component, call `useExpensesListQuery` and pass it any options that fit your needs.
 * When your component renders, `useExpensesListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExpensesListQuery({
 *   variables: {
 *      date: // value for 'date'
 *   },
 * });
 */
export function useExpensesListQuery(baseOptions: Apollo.QueryHookOptions<ExpensesListQuery, ExpensesListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExpensesListQuery, ExpensesListQueryVariables>(ExpensesListDocument, options);
      }
export function useExpensesListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExpensesListQuery, ExpensesListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExpensesListQuery, ExpensesListQueryVariables>(ExpensesListDocument, options);
        }
export type ExpensesListQueryHookResult = ReturnType<typeof useExpensesListQuery>;
export type ExpensesListLazyQueryHookResult = ReturnType<typeof useExpensesListLazyQuery>;
export type ExpensesListQueryResult = Apollo.QueryResult<ExpensesListQuery, ExpensesListQueryVariables>;
export const ChartExpensesListDocument = gql`
    query ChartExpensesList($date: String!) {
  chartExpenses(filter: {date: $date})
}
    `;

/**
 * __useChartExpensesListQuery__
 *
 * To run a query within a React component, call `useChartExpensesListQuery` and pass it any options that fit your needs.
 * When your component renders, `useChartExpensesListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChartExpensesListQuery({
 *   variables: {
 *      date: // value for 'date'
 *   },
 * });
 */
export function useChartExpensesListQuery(baseOptions: Apollo.QueryHookOptions<ChartExpensesListQuery, ChartExpensesListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChartExpensesListQuery, ChartExpensesListQueryVariables>(ChartExpensesListDocument, options);
      }
export function useChartExpensesListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChartExpensesListQuery, ChartExpensesListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChartExpensesListQuery, ChartExpensesListQueryVariables>(ChartExpensesListDocument, options);
        }
export type ChartExpensesListQueryHookResult = ReturnType<typeof useChartExpensesListQuery>;
export type ChartExpensesListLazyQueryHookResult = ReturnType<typeof useChartExpensesListLazyQuery>;
export type ChartExpensesListQueryResult = Apollo.QueryResult<ChartExpensesListQuery, ChartExpensesListQueryVariables>;
export const CreateExpenseDocument = gql`
    mutation CreateExpense($subcategoryId: ID!, $amount: Int!, $date: String!) {
  createExpense(subcategoryId: $subcategoryId, amount: $amount, date: $date) {
    id
    amount
    date
  }
}
    `;
export type CreateExpenseMutationFn = Apollo.MutationFunction<CreateExpenseMutation, CreateExpenseMutationVariables>;

/**
 * __useCreateExpenseMutation__
 *
 * To run a mutation, you first call `useCreateExpenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateExpenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createExpenseMutation, { data, loading, error }] = useCreateExpenseMutation({
 *   variables: {
 *      subcategoryId: // value for 'subcategoryId'
 *      amount: // value for 'amount'
 *      date: // value for 'date'
 *   },
 * });
 */
export function useCreateExpenseMutation(baseOptions?: Apollo.MutationHookOptions<CreateExpenseMutation, CreateExpenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateExpenseMutation, CreateExpenseMutationVariables>(CreateExpenseDocument, options);
      }
export type CreateExpenseMutationHookResult = ReturnType<typeof useCreateExpenseMutation>;
export type CreateExpenseMutationResult = Apollo.MutationResult<CreateExpenseMutation>;
export type CreateExpenseMutationOptions = Apollo.BaseMutationOptions<CreateExpenseMutation, CreateExpenseMutationVariables>;
export const UpdateExpenseDocument = gql`
    mutation UpdateExpense($id: ID!, $subcategoryId: ID!, $amount: Int!, $date: String!) {
  updateExpense(
    id: $id
    subcategoryId: $subcategoryId
    amount: $amount
    date: $date
  ) {
    id
    amount
    date
  }
}
    `;
export type UpdateExpenseMutationFn = Apollo.MutationFunction<UpdateExpenseMutation, UpdateExpenseMutationVariables>;

/**
 * __useUpdateExpenseMutation__
 *
 * To run a mutation, you first call `useUpdateExpenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExpenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExpenseMutation, { data, loading, error }] = useUpdateExpenseMutation({
 *   variables: {
 *      id: // value for 'id'
 *      subcategoryId: // value for 'subcategoryId'
 *      amount: // value for 'amount'
 *      date: // value for 'date'
 *   },
 * });
 */
export function useUpdateExpenseMutation(baseOptions?: Apollo.MutationHookOptions<UpdateExpenseMutation, UpdateExpenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateExpenseMutation, UpdateExpenseMutationVariables>(UpdateExpenseDocument, options);
      }
export type UpdateExpenseMutationHookResult = ReturnType<typeof useUpdateExpenseMutation>;
export type UpdateExpenseMutationResult = Apollo.MutationResult<UpdateExpenseMutation>;
export type UpdateExpenseMutationOptions = Apollo.BaseMutationOptions<UpdateExpenseMutation, UpdateExpenseMutationVariables>;
export const DeleteExpenseDocument = gql`
    mutation DeleteExpense($id: ID!) {
  deleteExpense(id: $id) {
    id
  }
}
    `;
export type DeleteExpenseMutationFn = Apollo.MutationFunction<DeleteExpenseMutation, DeleteExpenseMutationVariables>;

/**
 * __useDeleteExpenseMutation__
 *
 * To run a mutation, you first call `useDeleteExpenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteExpenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteExpenseMutation, { data, loading, error }] = useDeleteExpenseMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteExpenseMutation(baseOptions?: Apollo.MutationHookOptions<DeleteExpenseMutation, DeleteExpenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteExpenseMutation, DeleteExpenseMutationVariables>(DeleteExpenseDocument, options);
      }
export type DeleteExpenseMutationHookResult = ReturnType<typeof useDeleteExpenseMutation>;
export type DeleteExpenseMutationResult = Apollo.MutationResult<DeleteExpenseMutation>;
export type DeleteExpenseMutationOptions = Apollo.BaseMutationOptions<DeleteExpenseMutation, DeleteExpenseMutationVariables>;
export const SignupDocument = gql`
    mutation Signup($email: String!, $password: String!) {
  signup(email: $email, password: $password) {
    token
    user {
      email
    }
  }
}
    `;
export type SignupMutationFn = Apollo.MutationFunction<SignupMutation, SignupMutationVariables>;

/**
 * __useSignupMutation__
 *
 * To run a mutation, you first call `useSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupMutation, { data, loading, error }] = useSignupMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignupMutation(baseOptions?: Apollo.MutationHookOptions<SignupMutation, SignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, options);
      }
export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = Apollo.MutationResult<SignupMutation>;
export type SignupMutationOptions = Apollo.BaseMutationOptions<SignupMutation, SignupMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      email
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const ResetPasswordRequestDocument = gql`
    mutation ResetPasswordRequest($email: String!) {
  resetPasswordRequest(email: $email) {
    email
  }
}
    `;
export type ResetPasswordRequestMutationFn = Apollo.MutationFunction<ResetPasswordRequestMutation, ResetPasswordRequestMutationVariables>;

/**
 * __useResetPasswordRequestMutation__
 *
 * To run a mutation, you first call `useResetPasswordRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordRequestMutation, { data, loading, error }] = useResetPasswordRequestMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useResetPasswordRequestMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordRequestMutation, ResetPasswordRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordRequestMutation, ResetPasswordRequestMutationVariables>(ResetPasswordRequestDocument, options);
      }
export type ResetPasswordRequestMutationHookResult = ReturnType<typeof useResetPasswordRequestMutation>;
export type ResetPasswordRequestMutationResult = Apollo.MutationResult<ResetPasswordRequestMutation>;
export type ResetPasswordRequestMutationOptions = Apollo.BaseMutationOptions<ResetPasswordRequestMutation, ResetPasswordRequestMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($token: String!, $password: String!) {
  resetPassword(token: $token, password: $password) {
    email
  }
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;