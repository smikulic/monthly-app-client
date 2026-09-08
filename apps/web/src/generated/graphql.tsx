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

export type BudgetStreak = {
  __typename?: 'BudgetStreak';
  categoryName: Scalars['String'];
  monthsUnderBudget: Scalars['Int'];
  subcategoryId: Scalars['ID'];
  subcategoryName: Scalars['String'];
};

export type Category = {
  __typename?: 'Category';
  groupId?: Maybe<Scalars['ID']>;
  icon?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  subcategories?: Maybe<Array<Maybe<Subcategory>>>;
  user?: Maybe<User>;
};

export type CategoryExpenseTotal = {
  __typename?: 'CategoryExpenseTotal';
  categoryName: Scalars['String'];
  subcategoryName: Scalars['String'];
  total: Scalars['Int'];
};

export type CategoryMover = {
  __typename?: 'CategoryMover';
  categoryId: Scalars['ID'];
  categoryName: Scalars['String'];
  currentTotal: Scalars['Int'];
  delta: Scalars['Int'];
  percentChange?: Maybe<Scalars['Float']>;
  previousTotal: Scalars['Int'];
};

export type CategoryPace = {
  __typename?: 'CategoryPace';
  budget: Scalars['Int'];
  categoryId: Scalars['ID'];
  categoryName: Scalars['String'];
  groupId?: Maybe<Scalars['ID']>;
  percentUsed: Scalars['Float'];
  projected: Scalars['Int'];
  safeToSpend: Scalars['Int'];
  spent: Scalars['Int'];
};

export type ChartExpensesPayload = {
  __typename?: 'ChartExpensesPayload';
  categoryExpenseTotals: Array<CategoryExpenseTotal>;
  /** Budget in force in each month of the year, so a mid-year change shows as a step. */
  monthlyBudgets: Array<Scalars['Int']>;
  monthlyTotals: Array<Scalars['Int']>;
  /** Spend in shared categories only, one series per member. Empty when nothing is shared. */
  sharedMonthlyByUser: Array<SharedUserSeries>;
};

export type CreateInvestmentInput = {
  amount?: InputMaybe<Scalars['Int']>;
  currency: Scalars['String'];
  initialAmount: Scalars['Int'];
  name: Scalars['String'];
  quantity: Scalars['Float'];
  startDate: Scalars['String'];
};

export type Expense = {
  __typename?: 'Expense';
  amount: Scalars['Int'];
  date: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  paidBy?: Maybe<User>;
  subcategoryId: Scalars['ID'];
};

export type ExpenseFilterInput = {
  date: Scalars['String'];
};

export type GoogleAuthUrl = {
  __typename?: 'GoogleAuthUrl';
  url: Scalars['String'];
};

export type Group = {
  __typename?: 'Group';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  invites: Array<GroupInvite>;
  members: Array<GroupMember>;
  name: Scalars['String'];
};

export type GroupInvite = {
  __typename?: 'GroupInvite';
  email: Scalars['String'];
  expiresAt: Scalars['String'];
  id: Scalars['ID'];
  role: GroupRole;
  status: InviteStatus;
};

export type GroupMember = {
  __typename?: 'GroupMember';
  id: Scalars['ID'];
  role: GroupRole;
  user: User;
};

export enum GroupRole {
  Admin = 'ADMIN',
  Member = 'MEMBER',
  Owner = 'OWNER',
  Viewer = 'VIEWER'
}

export enum ImportMode {
  Merge = 'MERGE',
  Replace = 'REPLACE'
}

export type ImportResult = {
  __typename?: 'ImportResult';
  categories: Scalars['Int'];
  expenses: Scalars['Int'];
  investments: Scalars['Int'];
  savingGoals: Scalars['Int'];
  subcategories: Scalars['Int'];
};

export type InsightsPayload = {
  __typename?: 'InsightsPayload';
  biggestMovers: Array<CategoryMover>;
  currentMonthTotal: Scalars['Int'];
  daysElapsed: Scalars['Int'];
  daysInMonth: Scalars['Int'];
  monthOverMonthDelta: Scalars['Int'];
  monthOverMonthPercent?: Maybe<Scalars['Float']>;
  pace: Array<CategoryPace>;
  previousMonthTotal: Scalars['Int'];
  /** The same spend broken down per shared subcategory. Empty when nothing is shared. */
  sharedSplits: Array<SharedSubcategorySplit>;
  /** Spend in shared categories only, per member, across the viewed month. */
  sharedTotalsByUser: Array<SharedSpender>;
  streaks: Array<BudgetStreak>;
  topExpenses: Array<TopExpense>;
  totalBudget: Scalars['Int'];
  totalProjected: Scalars['Int'];
  totalSafeToSpend: Scalars['Int'];
  totalSpent: Scalars['Int'];
};

export type Investment = {
  __typename?: 'Investment';
  amount: Scalars['Int'];
  createdAt: Scalars['String'];
  currency: Scalars['String'];
  id: Scalars['ID'];
  initialAmount: Scalars['Int'];
  name: Scalars['String'];
  quantity: Scalars['Float'];
  startDate: Scalars['String'];
  updatedAt: Scalars['String'];
};

export enum InviteStatus {
  Accepted = 'ACCEPTED',
  Expired = 'EXPIRED',
  Pending = 'PENDING',
  Revoked = 'REVOKED'
}

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  acceptGroupInvite: Group;
  confirmEmail: AuthPayload;
  createCategory: Category;
  createExpense: Expense;
  createGroup: Group;
  createInvestment: Investment;
  createSavingGoal: SavingGoal;
  createSubcategory: Subcategory;
  deleteAccount: Scalars['Boolean'];
  deleteCategory: Category;
  deleteExpense: Expense;
  deleteGroup: Scalars['Boolean'];
  deleteInvestment: Scalars['Boolean'];
  deleteSavingGoal: SavingGoal;
  deleteSubcategory: Subcategory;
  /** Removes the period starting in that month. The last remaining one cannot go. */
  deleteSubcategoryBudget: Subcategory;
  googleLogin: AuthPayload;
  importData: ImportResult;
  inviteToGroup: GroupInvite;
  leaveGroup: Scalars['Boolean'];
  login?: Maybe<AuthPayload>;
  removeGroupMember: Scalars['Boolean'];
  resetPassword: User;
  resetPasswordRequest: PasswordResetRequestPayload;
  revokeGroupInvite: Scalars['Boolean'];
  setPassword: User;
  /**
   * Adds or replaces the amount effective from validFrom, leaving every earlier
   * month on the amount it already had.
   */
  setSubcategoryBudget: Subcategory;
  shareCategory: Category;
  signup?: Maybe<AuthPayload>;
  unshareCategory: Category;
  updateCategory: Category;
  updateExpense: Expense;
  updateGroup: Group;
  updateInvestment: Investment;
  updateSavingGoal: SavingGoal;
  /** Renames or re-files. Amounts live on the schedule. */
  updateSubcategory: Subcategory;
  updateUser: User;
};


export type MutationAcceptGroupInviteArgs = {
  token: Scalars['String'];
};


export type MutationConfirmEmailArgs = {
  token: Scalars['String'];
};


export type MutationCreateCategoryArgs = {
  groupId?: InputMaybe<Scalars['ID']>;
  icon?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};


export type MutationCreateExpenseArgs = {
  amount: Scalars['Int'];
  date: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  paidByUserId?: InputMaybe<Scalars['ID']>;
  subcategoryId: Scalars['ID'];
};


export type MutationCreateGroupArgs = {
  name: Scalars['String'];
};


export type MutationCreateInvestmentArgs = {
  input: CreateInvestmentInput;
};


export type MutationCreateSavingGoalArgs = {
  goalAmount: Scalars['Int'];
  goalDate: Scalars['String'];
  initialSaveAmount?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
};


export type MutationCreateSubcategoryArgs = {
  budgetAmount: Scalars['Int'];
  categoryId: Scalars['ID'];
  icon?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  validFrom: Scalars['String'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteExpenseArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteGroupArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteInvestmentArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSavingGoalArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSubcategoryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSubcategoryBudgetArgs = {
  subcategoryId: Scalars['ID'];
  validFrom: Scalars['String'];
};


export type MutationGoogleLoginArgs = {
  code: Scalars['String'];
};


export type MutationImportDataArgs = {
  mode: ImportMode;
  payload: Scalars['String'];
};


export type MutationInviteToGroupArgs = {
  email: Scalars['String'];
  groupId: Scalars['ID'];
  role?: InputMaybe<GroupRole>;
};


export type MutationLeaveGroupArgs = {
  groupId: Scalars['ID'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRemoveGroupMemberArgs = {
  groupId: Scalars['ID'];
  userId: Scalars['ID'];
};


export type MutationResetPasswordArgs = {
  password: Scalars['String'];
  token: Scalars['String'];
};


export type MutationResetPasswordRequestArgs = {
  email: Scalars['String'];
};


export type MutationRevokeGroupInviteArgs = {
  inviteId: Scalars['ID'];
};


export type MutationSetPasswordArgs = {
  password: Scalars['String'];
};


export type MutationSetSubcategoryBudgetArgs = {
  amount: Scalars['Int'];
  subcategoryId: Scalars['ID'];
  validFrom: Scalars['String'];
};


export type MutationShareCategoryArgs = {
  categoryId: Scalars['ID'];
  groupId: Scalars['ID'];
};


export type MutationSignupArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUnshareCategoryArgs = {
  categoryId: Scalars['ID'];
};


export type MutationUpdateCategoryArgs = {
  icon?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationUpdateExpenseArgs = {
  amount: Scalars['Int'];
  date: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  paidByUserId?: InputMaybe<Scalars['ID']>;
  subcategoryId: Scalars['ID'];
};


export type MutationUpdateGroupArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationUpdateInvestmentArgs = {
  input: UpdateInvestmentInput;
};


export type MutationUpdateSavingGoalArgs = {
  goalAmount: Scalars['Int'];
  goalDate: Scalars['String'];
  id: Scalars['ID'];
  initialSaveAmount?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
};


export type MutationUpdateSubcategoryArgs = {
  categoryId: Scalars['ID'];
  id: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  currency: Scalars['String'];
  id: Scalars['ID'];
  weeklyReminder: Scalars['Boolean'];
};

export type PasswordResetRequestPayload = {
  __typename?: 'PasswordResetRequestPayload';
  email: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  categories: Array<Category>;
  category: Category;
  chartExpenses: ChartExpensesPayload;
  expenses: Array<Expense>;
  generateCsvReport: Scalars['String'];
  generateDataExport: Scalars['String'];
  generateReport: Scalars['String'];
  googleAuthUrl: GoogleAuthUrl;
  group: Group;
  insights: InsightsPayload;
  investment?: Maybe<Investment>;
  investments: Array<Investment>;
  me: User;
  myGroups: Array<Group>;
  savingGoals: Array<SavingGoal>;
  subcategories: Array<Subcategory>;
  subcategory: Subcategory;
  user: User;
  users: Array<User>;
};


export type QueryCategoriesArgs = {
  groupId?: InputMaybe<Scalars['ID']>;
  scope?: InputMaybe<ScopeMode>;
};


export type QueryCategoryArgs = {
  id: Scalars['ID'];
};


export type QueryChartExpensesArgs = {
  filter?: InputMaybe<ExpenseFilterInput>;
  groupId?: InputMaybe<Scalars['ID']>;
  scope?: InputMaybe<ScopeMode>;
};


export type QueryExpensesArgs = {
  filter?: InputMaybe<ExpenseFilterInput>;
  groupId?: InputMaybe<Scalars['ID']>;
  scope?: InputMaybe<ScopeMode>;
};


export type QueryGenerateCsvReportArgs = {
  year: Scalars['Int'];
};


export type QueryGenerateReportArgs = {
  year: Scalars['Int'];
};


export type QueryGroupArgs = {
  id: Scalars['ID'];
};


export type QueryInsightsArgs = {
  date: Scalars['String'];
  groupId?: InputMaybe<Scalars['ID']>;
  scope?: InputMaybe<ScopeMode>;
};


export type QueryInvestmentArgs = {
  id: Scalars['ID'];
};


export type QuerySubcategoryArgs = {
  id: Scalars['ID'];
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type SavingGoal = {
  __typename?: 'SavingGoal';
  createdAt: Scalars['String'];
  goalAmount: Scalars['Int'];
  goalDate: Scalars['String'];
  id: Scalars['ID'];
  initialSaveAmount?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  user?: Maybe<User>;
};

export enum ScopeMode {
  All = 'ALL',
  Group = 'GROUP',
  Mine = 'MINE'
}

/** One member's spend. Present with 0 when they spent nothing, so a comparison is not ambiguous. */
export type SharedSpender = {
  __typename?: 'SharedSpender';
  name: Scalars['String'];
  spent: Scalars['Int'];
  userId: Scalars['ID'];
};

/** A shared subcategory, split by who paid. */
export type SharedSubcategorySplit = {
  __typename?: 'SharedSubcategorySplit';
  categoryName: Scalars['String'];
  perUser: Array<SharedSpender>;
  subcategoryId: Scalars['ID'];
  subcategoryName: Scalars['String'];
  total: Scalars['Int'];
};

/** One person's shared spend across the year, month by month. */
export type SharedUserSeries = {
  __typename?: 'SharedUserSeries';
  monthlyTotals: Array<Scalars['Int']>;
  name: Scalars['String'];
  total: Scalars['Int'];
  userId: Scalars['ID'];
};

export type Subcategory = {
  __typename?: 'Subcategory';
  /** The amount in force today. For any other month use budgetForMonth. */
  budgetAmount?: Maybe<Scalars['Int']>;
  /** The amount that applied in the given month, 0 before the schedule opens. */
  budgetForMonth: Scalars['Int'];
  /** The amount schedule, oldest first. */
  budgets: Array<SubcategoryBudget>;
  categoryId: Scalars['ID'];
  createdAt: Scalars['String'];
  expenses?: Maybe<Array<Maybe<Expense>>>;
  icon?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  /** The month the schedule opens. Mirrors the earliest budget period. */
  rolloverDate: Scalars['String'];
  /** Everything accrued up to the end of that month, minus everything spent. */
  rolloverRemaining: Scalars['Int'];
};


export type SubcategoryBudgetForMonthArgs = {
  date: Scalars['String'];
};


export type SubcategoryExpensesArgs = {
  filter?: InputMaybe<ExpenseFilterInput>;
};


export type SubcategoryRolloverRemainingArgs = {
  date: Scalars['String'];
};

export type SubcategoryBudget = {
  __typename?: 'SubcategoryBudget';
  amount: Scalars['Int'];
  id: Scalars['ID'];
  validFrom: Scalars['String'];
};

export type TopExpense = {
  __typename?: 'TopExpense';
  amount: Scalars['Int'];
  categoryName: Scalars['String'];
  date: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  paidByName?: Maybe<Scalars['String']>;
  subcategoryName: Scalars['String'];
};

export type UpdateInvestmentInput = {
  amount?: InputMaybe<Scalars['Int']>;
  currency?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  initialAmount?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  quantity?: InputMaybe<Scalars['Float']>;
  startDate?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  categories?: Maybe<Array<Maybe<Category>>>;
  currency?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  emailConfirmed?: Maybe<Scalars['Boolean']>;
  expenses?: Maybe<Array<Maybe<Expense>>>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  picture?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['String']>;
  weeklyReminder?: Maybe<Scalars['Boolean']>;
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, email: string, currency?: string | null, weeklyReminder?: boolean | null, name?: string | null, picture?: string | null, provider?: string | null } };

export type MeIdQueryVariables = Exact<{ [key: string]: never; }>;


export type MeIdQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string } };

export type MyGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyGroupsQuery = { __typename?: 'Query', myGroups: Array<{ __typename?: 'Group', id: string, name: string, members: Array<{ __typename?: 'GroupMember', id: string, role: GroupRole, user: { __typename?: 'User', id: string, name?: string | null, email: string } }>, invites: Array<{ __typename?: 'GroupInvite', id: string, email: string, status: InviteStatus }> }> };

export type CreateGroupMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateGroupMutation = { __typename?: 'Mutation', createGroup: { __typename?: 'Group', id: string, name: string } };

export type InviteToGroupMutationVariables = Exact<{
  groupId: Scalars['ID'];
  email: Scalars['String'];
}>;


export type InviteToGroupMutation = { __typename?: 'Mutation', inviteToGroup: { __typename?: 'GroupInvite', id: string, email: string, status: InviteStatus } };

export type AcceptGroupInviteMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type AcceptGroupInviteMutation = { __typename?: 'Mutation', acceptGroupInvite: { __typename?: 'Group', id: string, name: string } };

export type RevokeGroupInviteMutationVariables = Exact<{
  inviteId: Scalars['ID'];
}>;


export type RevokeGroupInviteMutation = { __typename?: 'Mutation', revokeGroupInvite: boolean };

export type RemoveGroupMemberMutationVariables = Exact<{
  groupId: Scalars['ID'];
  userId: Scalars['ID'];
}>;


export type RemoveGroupMemberMutation = { __typename?: 'Mutation', removeGroupMember: boolean };

export type LeaveGroupMutationVariables = Exact<{
  groupId: Scalars['ID'];
}>;


export type LeaveGroupMutation = { __typename?: 'Mutation', leaveGroup: boolean };

export type DeleteGroupMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteGroupMutation = { __typename?: 'Mutation', deleteGroup: boolean };

export type ShareCategoryMutationVariables = Exact<{
  categoryId: Scalars['ID'];
  groupId: Scalars['ID'];
}>;


export type ShareCategoryMutation = { __typename?: 'Mutation', shareCategory: { __typename?: 'Category', id: string, groupId?: string | null } };

export type UnshareCategoryMutationVariables = Exact<{
  categoryId: Scalars['ID'];
}>;


export type UnshareCategoryMutation = { __typename?: 'Mutation', unshareCategory: { __typename?: 'Category', id: string, groupId?: string | null } };

export type CategoriesListQueryVariables = Exact<{
  scope?: InputMaybe<ScopeMode>;
  groupId?: InputMaybe<Scalars['ID']>;
  date: Scalars['String'];
}>;


export type CategoriesListQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, name: string, groupId?: string | null, user?: { __typename?: 'User', id: string } | null, subcategories?: Array<{ __typename?: 'Subcategory', id: string, categoryId: string, createdAt: string, name: string, budgetAmount?: number | null, budgetForMonth: number, rolloverRemaining: number, budgets: Array<{ __typename?: 'SubcategoryBudget', id: string, amount: number, validFrom: string }> } | null> | null }> };

export type CreateCategoryMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'Category', id: string, name: string } };

export type UpdateCategoryMutationVariables = Exact<{
  id: Scalars['ID'];
  name: Scalars['String'];
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'Category', id: string, name: string } };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: { __typename?: 'Category', name: string } };

export type CreateSubcategoryMutationVariables = Exact<{
  categoryId: Scalars['ID'];
  name: Scalars['String'];
  budgetAmount: Scalars['Int'];
  validFrom: Scalars['String'];
}>;


export type CreateSubcategoryMutation = { __typename?: 'Mutation', createSubcategory: { __typename?: 'Subcategory', id: string, categoryId: string, name: string, budgetAmount?: number | null } };

export type UpdateSubcategoryMutationVariables = Exact<{
  id: Scalars['ID'];
  categoryId: Scalars['ID'];
  name: Scalars['String'];
}>;


export type UpdateSubcategoryMutation = { __typename?: 'Mutation', updateSubcategory: { __typename?: 'Subcategory', id: string, categoryId: string, name: string, budgetAmount?: number | null } };

export type SetSubcategoryBudgetMutationVariables = Exact<{
  subcategoryId: Scalars['ID'];
  amount: Scalars['Int'];
  validFrom: Scalars['String'];
}>;


export type SetSubcategoryBudgetMutation = { __typename?: 'Mutation', setSubcategoryBudget: { __typename?: 'Subcategory', id: string, budgetAmount?: number | null, rolloverDate: string, budgets: Array<{ __typename?: 'SubcategoryBudget', id: string, amount: number, validFrom: string }> } };

export type DeleteSubcategoryBudgetMutationVariables = Exact<{
  subcategoryId: Scalars['ID'];
  validFrom: Scalars['String'];
}>;


export type DeleteSubcategoryBudgetMutation = { __typename?: 'Mutation', deleteSubcategoryBudget: { __typename?: 'Subcategory', id: string, budgetAmount?: number | null, rolloverDate: string, budgets: Array<{ __typename?: 'SubcategoryBudget', id: string, amount: number, validFrom: string }> } };

export type DeleteSubcategoryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteSubcategoryMutation = { __typename?: 'Mutation', deleteSubcategory: { __typename?: 'Subcategory', name: string } };

export type ConfirmEmailMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type ConfirmEmailMutation = { __typename?: 'Mutation', confirmEmail: { __typename?: 'AuthPayload', token?: string | null, user?: { __typename?: 'User', email: string } | null } };

export type ExpensesListQueryVariables = Exact<{
  date: Scalars['String'];
  scope?: InputMaybe<ScopeMode>;
  groupId?: InputMaybe<Scalars['ID']>;
}>;


export type ExpensesListQuery = { __typename?: 'Query', expenses: Array<{ __typename?: 'Expense', id: string, subcategoryId: string, amount: number, description?: string | null, date: string, paidBy?: { __typename?: 'User', id: string } | null }> };

export type ChartExpensesListQueryVariables = Exact<{
  date: Scalars['String'];
  scope?: InputMaybe<ScopeMode>;
  groupId?: InputMaybe<Scalars['ID']>;
}>;


export type ChartExpensesListQuery = { __typename?: 'Query', chartExpenses: { __typename?: 'ChartExpensesPayload', monthlyTotals: Array<number>, monthlyBudgets: Array<number>, sharedMonthlyByUser: Array<{ __typename?: 'SharedUserSeries', userId: string, name: string, monthlyTotals: Array<number>, total: number }>, categoryExpenseTotals: Array<{ __typename?: 'CategoryExpenseTotal', categoryName: string, subcategoryName: string, total: number }> } };

export type CreateExpenseMutationVariables = Exact<{
  subcategoryId: Scalars['ID'];
  amount: Scalars['Int'];
  description?: InputMaybe<Scalars['String']>;
  date: Scalars['String'];
  paidByUserId?: InputMaybe<Scalars['ID']>;
}>;


export type CreateExpenseMutation = { __typename?: 'Mutation', createExpense: { __typename?: 'Expense', id: string, amount: number, description?: string | null, date: string, paidBy?: { __typename?: 'User', id: string } | null } };

export type UpdateExpenseMutationVariables = Exact<{
  id: Scalars['ID'];
  subcategoryId: Scalars['ID'];
  amount: Scalars['Int'];
  description?: InputMaybe<Scalars['String']>;
  date: Scalars['String'];
  paidByUserId?: InputMaybe<Scalars['ID']>;
}>;


export type UpdateExpenseMutation = { __typename?: 'Mutation', updateExpense: { __typename?: 'Expense', id: string, amount: number, description?: string | null, date: string, paidBy?: { __typename?: 'User', id: string } | null } };

export type DeleteExpenseMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteExpenseMutation = { __typename?: 'Mutation', deleteExpense: { __typename?: 'Expense', id: string } };

export type GoogleLoginMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type GoogleLoginMutation = { __typename?: 'Mutation', googleLogin: { __typename?: 'AuthPayload', token?: string | null, user?: { __typename?: 'User', id: string, email: string, name?: string | null, picture?: string | null, provider?: string | null } | null } };

export type InsightsQueryVariables = Exact<{
  date: Scalars['String'];
  scope?: InputMaybe<ScopeMode>;
  groupId?: InputMaybe<Scalars['ID']>;
}>;


export type InsightsQuery = { __typename?: 'Query', insights: { __typename?: 'InsightsPayload', daysElapsed: number, daysInMonth: number, totalBudget: number, totalSpent: number, totalProjected: number, totalSafeToSpend: number, currentMonthTotal: number, previousMonthTotal: number, monthOverMonthDelta: number, monthOverMonthPercent?: number | null, pace: Array<{ __typename?: 'CategoryPace', categoryId: string, categoryName: string, budget: number, spent: number, projected: number, safeToSpend: number, percentUsed: number }>, biggestMovers: Array<{ __typename?: 'CategoryMover', categoryId: string, categoryName: string, currentTotal: number, previousTotal: number, delta: number, percentChange?: number | null }>, topExpenses: Array<{ __typename?: 'TopExpense', id: string, amount: number, description?: string | null, date: string, subcategoryName: string, categoryName: string, paidByName?: string | null }>, streaks: Array<{ __typename?: 'BudgetStreak', subcategoryId: string, subcategoryName: string, categoryName: string, monthsUnderBudget: number }>, sharedTotalsByUser: Array<{ __typename?: 'SharedSpender', userId: string, name: string, spent: number }>, sharedSplits: Array<{ __typename?: 'SharedSubcategorySplit', subcategoryId: string, subcategoryName: string, categoryName: string, total: number, perUser: Array<{ __typename?: 'SharedSpender', userId: string, name: string, spent: number }> }> } };

export type InvestmentsListQueryVariables = Exact<{ [key: string]: never; }>;


export type InvestmentsListQuery = { __typename?: 'Query', investments: Array<{ __typename?: 'Investment', id: string, createdAt: string, updatedAt: string, name: string, quantity: number, amount: number, currency: string, startDate: string, initialAmount: number }> };

export type CreateInvestmentMutationVariables = Exact<{
  input: CreateInvestmentInput;
}>;


export type CreateInvestmentMutation = { __typename?: 'Mutation', createInvestment: { __typename?: 'Investment', id: string, name: string, initialAmount: number, currency: string } };

export type UpdateInvestmentMutationVariables = Exact<{
  input: UpdateInvestmentInput;
}>;


export type UpdateInvestmentMutation = { __typename?: 'Mutation', updateInvestment: { __typename?: 'Investment', id: string, name: string } };

export type DeleteInvestmentMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteInvestmentMutation = { __typename?: 'Mutation', deleteInvestment: boolean };

export type SignupMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignupMutation = { __typename?: 'Mutation', signup?: { __typename?: 'AuthPayload', token?: string | null, user?: { __typename?: 'User', id: string, email: string, name?: string | null, picture?: string | null, provider?: string | null } | null } | null };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'AuthPayload', token?: string | null, user?: { __typename?: 'User', id: string, email: string, name?: string | null, picture?: string | null, provider?: string | null } | null } | null };

export type GoogleAuthUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type GoogleAuthUrlQuery = { __typename?: 'Query', googleAuthUrl: { __typename?: 'GoogleAuthUrl', url: string } };

export type ResetPasswordRequestMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ResetPasswordRequestMutation = { __typename?: 'Mutation', resetPasswordRequest: { __typename?: 'PasswordResetRequestPayload', email: string } };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID'];
  currency: Scalars['String'];
  weeklyReminder: Scalars['Boolean'];
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', email: string, currency?: string | null, weeklyReminder?: boolean | null } };

export type DeleteAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAccountMutation = { __typename?: 'Mutation', deleteAccount: boolean };

export type GenerateReportQueryVariables = Exact<{
  year: Scalars['Int'];
}>;


export type GenerateReportQuery = { __typename?: 'Query', generateReport: string };

export type GenerateCsvReportQueryVariables = Exact<{
  year: Scalars['Int'];
}>;


export type GenerateCsvReportQuery = { __typename?: 'Query', generateCsvReport: string };

export type GenerateDataExportQueryVariables = Exact<{ [key: string]: never; }>;


export type GenerateDataExportQuery = { __typename?: 'Query', generateDataExport: string };

export type ImportDataMutationVariables = Exact<{
  payload: Scalars['String'];
  mode: ImportMode;
}>;


export type ImportDataMutation = { __typename?: 'Mutation', importData: { __typename?: 'ImportResult', categories: number, subcategories: number, expenses: number, savingGoals: number, investments: number } };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'User', email: string } };

export type SavingGoalsListQueryVariables = Exact<{ [key: string]: never; }>;


export type SavingGoalsListQuery = { __typename?: 'Query', savingGoals: Array<{ __typename?: 'SavingGoal', id: string, createdAt: string, name: string, goalDate: string, goalAmount: number, initialSaveAmount?: number | null }> };

export type CreateSavingGoalMutationVariables = Exact<{
  name: Scalars['String'];
  goalDate: Scalars['String'];
  goalAmount: Scalars['Int'];
  initialSaveAmount?: InputMaybe<Scalars['Int']>;
}>;


export type CreateSavingGoalMutation = { __typename?: 'Mutation', createSavingGoal: { __typename?: 'SavingGoal', name: string, goalAmount: number, goalDate: string } };

export type UpdateSavingGoalMutationVariables = Exact<{
  id: Scalars['ID'];
  name: Scalars['String'];
  goalDate: Scalars['String'];
  goalAmount: Scalars['Int'];
  initialSaveAmount?: InputMaybe<Scalars['Int']>;
}>;


export type UpdateSavingGoalMutation = { __typename?: 'Mutation', updateSavingGoal: { __typename?: 'SavingGoal', name: string } };

export type DeleteSavingGoalMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteSavingGoalMutation = { __typename?: 'Mutation', deleteSavingGoal: { __typename?: 'SavingGoal', name: string } };


export const MeDocument = gql`
    query Me {
  me {
    id
    email
    currency
    weeklyReminder
    name
    picture
    provider
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const MeIdDocument = gql`
    query MeId {
  me {
    id
  }
}
    `;

/**
 * __useMeIdQuery__
 *
 * To run a query within a React component, call `useMeIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeIdQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeIdQuery(baseOptions?: Apollo.QueryHookOptions<MeIdQuery, MeIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeIdQuery, MeIdQueryVariables>(MeIdDocument, options);
      }
export function useMeIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeIdQuery, MeIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeIdQuery, MeIdQueryVariables>(MeIdDocument, options);
        }
export type MeIdQueryHookResult = ReturnType<typeof useMeIdQuery>;
export type MeIdLazyQueryHookResult = ReturnType<typeof useMeIdLazyQuery>;
export type MeIdQueryResult = Apollo.QueryResult<MeIdQuery, MeIdQueryVariables>;
export const MyGroupsDocument = gql`
    query MyGroups {
  myGroups {
    id
    name
    members {
      id
      role
      user {
        id
        name
        email
      }
    }
    invites {
      id
      email
      status
    }
  }
}
    `;

/**
 * __useMyGroupsQuery__
 *
 * To run a query within a React component, call `useMyGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyGroupsQuery(baseOptions?: Apollo.QueryHookOptions<MyGroupsQuery, MyGroupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyGroupsQuery, MyGroupsQueryVariables>(MyGroupsDocument, options);
      }
export function useMyGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyGroupsQuery, MyGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyGroupsQuery, MyGroupsQueryVariables>(MyGroupsDocument, options);
        }
export type MyGroupsQueryHookResult = ReturnType<typeof useMyGroupsQuery>;
export type MyGroupsLazyQueryHookResult = ReturnType<typeof useMyGroupsLazyQuery>;
export type MyGroupsQueryResult = Apollo.QueryResult<MyGroupsQuery, MyGroupsQueryVariables>;
export const CreateGroupDocument = gql`
    mutation CreateGroup($name: String!) {
  createGroup(name: $name) {
    id
    name
  }
}
    `;
export type CreateGroupMutationFn = Apollo.MutationFunction<CreateGroupMutation, CreateGroupMutationVariables>;

/**
 * __useCreateGroupMutation__
 *
 * To run a mutation, you first call `useCreateGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGroupMutation, { data, loading, error }] = useCreateGroupMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateGroupMutation(baseOptions?: Apollo.MutationHookOptions<CreateGroupMutation, CreateGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGroupMutation, CreateGroupMutationVariables>(CreateGroupDocument, options);
      }
export type CreateGroupMutationHookResult = ReturnType<typeof useCreateGroupMutation>;
export type CreateGroupMutationResult = Apollo.MutationResult<CreateGroupMutation>;
export type CreateGroupMutationOptions = Apollo.BaseMutationOptions<CreateGroupMutation, CreateGroupMutationVariables>;
export const InviteToGroupDocument = gql`
    mutation InviteToGroup($groupId: ID!, $email: String!) {
  inviteToGroup(groupId: $groupId, email: $email) {
    id
    email
    status
  }
}
    `;
export type InviteToGroupMutationFn = Apollo.MutationFunction<InviteToGroupMutation, InviteToGroupMutationVariables>;

/**
 * __useInviteToGroupMutation__
 *
 * To run a mutation, you first call `useInviteToGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteToGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteToGroupMutation, { data, loading, error }] = useInviteToGroupMutation({
 *   variables: {
 *      groupId: // value for 'groupId'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useInviteToGroupMutation(baseOptions?: Apollo.MutationHookOptions<InviteToGroupMutation, InviteToGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InviteToGroupMutation, InviteToGroupMutationVariables>(InviteToGroupDocument, options);
      }
export type InviteToGroupMutationHookResult = ReturnType<typeof useInviteToGroupMutation>;
export type InviteToGroupMutationResult = Apollo.MutationResult<InviteToGroupMutation>;
export type InviteToGroupMutationOptions = Apollo.BaseMutationOptions<InviteToGroupMutation, InviteToGroupMutationVariables>;
export const AcceptGroupInviteDocument = gql`
    mutation AcceptGroupInvite($token: String!) {
  acceptGroupInvite(token: $token) {
    id
    name
  }
}
    `;
export type AcceptGroupInviteMutationFn = Apollo.MutationFunction<AcceptGroupInviteMutation, AcceptGroupInviteMutationVariables>;

/**
 * __useAcceptGroupInviteMutation__
 *
 * To run a mutation, you first call `useAcceptGroupInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptGroupInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptGroupInviteMutation, { data, loading, error }] = useAcceptGroupInviteMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useAcceptGroupInviteMutation(baseOptions?: Apollo.MutationHookOptions<AcceptGroupInviteMutation, AcceptGroupInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptGroupInviteMutation, AcceptGroupInviteMutationVariables>(AcceptGroupInviteDocument, options);
      }
export type AcceptGroupInviteMutationHookResult = ReturnType<typeof useAcceptGroupInviteMutation>;
export type AcceptGroupInviteMutationResult = Apollo.MutationResult<AcceptGroupInviteMutation>;
export type AcceptGroupInviteMutationOptions = Apollo.BaseMutationOptions<AcceptGroupInviteMutation, AcceptGroupInviteMutationVariables>;
export const RevokeGroupInviteDocument = gql`
    mutation RevokeGroupInvite($inviteId: ID!) {
  revokeGroupInvite(inviteId: $inviteId)
}
    `;
export type RevokeGroupInviteMutationFn = Apollo.MutationFunction<RevokeGroupInviteMutation, RevokeGroupInviteMutationVariables>;

/**
 * __useRevokeGroupInviteMutation__
 *
 * To run a mutation, you first call `useRevokeGroupInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRevokeGroupInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [revokeGroupInviteMutation, { data, loading, error }] = useRevokeGroupInviteMutation({
 *   variables: {
 *      inviteId: // value for 'inviteId'
 *   },
 * });
 */
export function useRevokeGroupInviteMutation(baseOptions?: Apollo.MutationHookOptions<RevokeGroupInviteMutation, RevokeGroupInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RevokeGroupInviteMutation, RevokeGroupInviteMutationVariables>(RevokeGroupInviteDocument, options);
      }
export type RevokeGroupInviteMutationHookResult = ReturnType<typeof useRevokeGroupInviteMutation>;
export type RevokeGroupInviteMutationResult = Apollo.MutationResult<RevokeGroupInviteMutation>;
export type RevokeGroupInviteMutationOptions = Apollo.BaseMutationOptions<RevokeGroupInviteMutation, RevokeGroupInviteMutationVariables>;
export const RemoveGroupMemberDocument = gql`
    mutation RemoveGroupMember($groupId: ID!, $userId: ID!) {
  removeGroupMember(groupId: $groupId, userId: $userId)
}
    `;
export type RemoveGroupMemberMutationFn = Apollo.MutationFunction<RemoveGroupMemberMutation, RemoveGroupMemberMutationVariables>;

/**
 * __useRemoveGroupMemberMutation__
 *
 * To run a mutation, you first call `useRemoveGroupMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveGroupMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeGroupMemberMutation, { data, loading, error }] = useRemoveGroupMemberMutation({
 *   variables: {
 *      groupId: // value for 'groupId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useRemoveGroupMemberMutation(baseOptions?: Apollo.MutationHookOptions<RemoveGroupMemberMutation, RemoveGroupMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveGroupMemberMutation, RemoveGroupMemberMutationVariables>(RemoveGroupMemberDocument, options);
      }
export type RemoveGroupMemberMutationHookResult = ReturnType<typeof useRemoveGroupMemberMutation>;
export type RemoveGroupMemberMutationResult = Apollo.MutationResult<RemoveGroupMemberMutation>;
export type RemoveGroupMemberMutationOptions = Apollo.BaseMutationOptions<RemoveGroupMemberMutation, RemoveGroupMemberMutationVariables>;
export const LeaveGroupDocument = gql`
    mutation LeaveGroup($groupId: ID!) {
  leaveGroup(groupId: $groupId)
}
    `;
export type LeaveGroupMutationFn = Apollo.MutationFunction<LeaveGroupMutation, LeaveGroupMutationVariables>;

/**
 * __useLeaveGroupMutation__
 *
 * To run a mutation, you first call `useLeaveGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveGroupMutation, { data, loading, error }] = useLeaveGroupMutation({
 *   variables: {
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useLeaveGroupMutation(baseOptions?: Apollo.MutationHookOptions<LeaveGroupMutation, LeaveGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LeaveGroupMutation, LeaveGroupMutationVariables>(LeaveGroupDocument, options);
      }
export type LeaveGroupMutationHookResult = ReturnType<typeof useLeaveGroupMutation>;
export type LeaveGroupMutationResult = Apollo.MutationResult<LeaveGroupMutation>;
export type LeaveGroupMutationOptions = Apollo.BaseMutationOptions<LeaveGroupMutation, LeaveGroupMutationVariables>;
export const DeleteGroupDocument = gql`
    mutation DeleteGroup($id: ID!) {
  deleteGroup(id: $id)
}
    `;
export type DeleteGroupMutationFn = Apollo.MutationFunction<DeleteGroupMutation, DeleteGroupMutationVariables>;

/**
 * __useDeleteGroupMutation__
 *
 * To run a mutation, you first call `useDeleteGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteGroupMutation, { data, loading, error }] = useDeleteGroupMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteGroupMutation(baseOptions?: Apollo.MutationHookOptions<DeleteGroupMutation, DeleteGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteGroupMutation, DeleteGroupMutationVariables>(DeleteGroupDocument, options);
      }
export type DeleteGroupMutationHookResult = ReturnType<typeof useDeleteGroupMutation>;
export type DeleteGroupMutationResult = Apollo.MutationResult<DeleteGroupMutation>;
export type DeleteGroupMutationOptions = Apollo.BaseMutationOptions<DeleteGroupMutation, DeleteGroupMutationVariables>;
export const ShareCategoryDocument = gql`
    mutation ShareCategory($categoryId: ID!, $groupId: ID!) {
  shareCategory(categoryId: $categoryId, groupId: $groupId) {
    id
    groupId
  }
}
    `;
export type ShareCategoryMutationFn = Apollo.MutationFunction<ShareCategoryMutation, ShareCategoryMutationVariables>;

/**
 * __useShareCategoryMutation__
 *
 * To run a mutation, you first call `useShareCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShareCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [shareCategoryMutation, { data, loading, error }] = useShareCategoryMutation({
 *   variables: {
 *      categoryId: // value for 'categoryId'
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useShareCategoryMutation(baseOptions?: Apollo.MutationHookOptions<ShareCategoryMutation, ShareCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ShareCategoryMutation, ShareCategoryMutationVariables>(ShareCategoryDocument, options);
      }
export type ShareCategoryMutationHookResult = ReturnType<typeof useShareCategoryMutation>;
export type ShareCategoryMutationResult = Apollo.MutationResult<ShareCategoryMutation>;
export type ShareCategoryMutationOptions = Apollo.BaseMutationOptions<ShareCategoryMutation, ShareCategoryMutationVariables>;
export const UnshareCategoryDocument = gql`
    mutation UnshareCategory($categoryId: ID!) {
  unshareCategory(categoryId: $categoryId) {
    id
    groupId
  }
}
    `;
export type UnshareCategoryMutationFn = Apollo.MutationFunction<UnshareCategoryMutation, UnshareCategoryMutationVariables>;

/**
 * __useUnshareCategoryMutation__
 *
 * To run a mutation, you first call `useUnshareCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnshareCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unshareCategoryMutation, { data, loading, error }] = useUnshareCategoryMutation({
 *   variables: {
 *      categoryId: // value for 'categoryId'
 *   },
 * });
 */
export function useUnshareCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UnshareCategoryMutation, UnshareCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnshareCategoryMutation, UnshareCategoryMutationVariables>(UnshareCategoryDocument, options);
      }
export type UnshareCategoryMutationHookResult = ReturnType<typeof useUnshareCategoryMutation>;
export type UnshareCategoryMutationResult = Apollo.MutationResult<UnshareCategoryMutation>;
export type UnshareCategoryMutationOptions = Apollo.BaseMutationOptions<UnshareCategoryMutation, UnshareCategoryMutationVariables>;
export const CategoriesListDocument = gql`
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
      budgetForMonth(date: $date)
      rolloverRemaining(date: $date)
      budgets {
        id
        amount
        validFrom
      }
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
 *      scope: // value for 'scope'
 *      groupId: // value for 'groupId'
 *      date: // value for 'date'
 *   },
 * });
 */
export function useCategoriesListQuery(baseOptions: Apollo.QueryHookOptions<CategoriesListQuery, CategoriesListQueryVariables>) {
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
    id
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
    id
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
    mutation CreateSubcategory($categoryId: ID!, $name: String!, $budgetAmount: Int!, $validFrom: String!) {
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
 *      validFrom: // value for 'validFrom'
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
    mutation UpdateSubcategory($id: ID!, $categoryId: ID!, $name: String!) {
  updateSubcategory(id: $id, categoryId: $categoryId, name: $name) {
    id
    categoryId
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
 *      categoryId: // value for 'categoryId'
 *      name: // value for 'name'
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
export const SetSubcategoryBudgetDocument = gql`
    mutation SetSubcategoryBudget($subcategoryId: ID!, $amount: Int!, $validFrom: String!) {
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
export type SetSubcategoryBudgetMutationFn = Apollo.MutationFunction<SetSubcategoryBudgetMutation, SetSubcategoryBudgetMutationVariables>;

/**
 * __useSetSubcategoryBudgetMutation__
 *
 * To run a mutation, you first call `useSetSubcategoryBudgetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetSubcategoryBudgetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setSubcategoryBudgetMutation, { data, loading, error }] = useSetSubcategoryBudgetMutation({
 *   variables: {
 *      subcategoryId: // value for 'subcategoryId'
 *      amount: // value for 'amount'
 *      validFrom: // value for 'validFrom'
 *   },
 * });
 */
export function useSetSubcategoryBudgetMutation(baseOptions?: Apollo.MutationHookOptions<SetSubcategoryBudgetMutation, SetSubcategoryBudgetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetSubcategoryBudgetMutation, SetSubcategoryBudgetMutationVariables>(SetSubcategoryBudgetDocument, options);
      }
export type SetSubcategoryBudgetMutationHookResult = ReturnType<typeof useSetSubcategoryBudgetMutation>;
export type SetSubcategoryBudgetMutationResult = Apollo.MutationResult<SetSubcategoryBudgetMutation>;
export type SetSubcategoryBudgetMutationOptions = Apollo.BaseMutationOptions<SetSubcategoryBudgetMutation, SetSubcategoryBudgetMutationVariables>;
export const DeleteSubcategoryBudgetDocument = gql`
    mutation DeleteSubcategoryBudget($subcategoryId: ID!, $validFrom: String!) {
  deleteSubcategoryBudget(subcategoryId: $subcategoryId, validFrom: $validFrom) {
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
export type DeleteSubcategoryBudgetMutationFn = Apollo.MutationFunction<DeleteSubcategoryBudgetMutation, DeleteSubcategoryBudgetMutationVariables>;

/**
 * __useDeleteSubcategoryBudgetMutation__
 *
 * To run a mutation, you first call `useDeleteSubcategoryBudgetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSubcategoryBudgetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSubcategoryBudgetMutation, { data, loading, error }] = useDeleteSubcategoryBudgetMutation({
 *   variables: {
 *      subcategoryId: // value for 'subcategoryId'
 *      validFrom: // value for 'validFrom'
 *   },
 * });
 */
export function useDeleteSubcategoryBudgetMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSubcategoryBudgetMutation, DeleteSubcategoryBudgetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSubcategoryBudgetMutation, DeleteSubcategoryBudgetMutationVariables>(DeleteSubcategoryBudgetDocument, options);
      }
export type DeleteSubcategoryBudgetMutationHookResult = ReturnType<typeof useDeleteSubcategoryBudgetMutation>;
export type DeleteSubcategoryBudgetMutationResult = Apollo.MutationResult<DeleteSubcategoryBudgetMutation>;
export type DeleteSubcategoryBudgetMutationOptions = Apollo.BaseMutationOptions<DeleteSubcategoryBudgetMutation, DeleteSubcategoryBudgetMutationVariables>;
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
export const ConfirmEmailDocument = gql`
    mutation ConfirmEmail($token: String!) {
  confirmEmail(token: $token) {
    token
    user {
      email
    }
  }
}
    `;
export type ConfirmEmailMutationFn = Apollo.MutationFunction<ConfirmEmailMutation, ConfirmEmailMutationVariables>;

/**
 * __useConfirmEmailMutation__
 *
 * To run a mutation, you first call `useConfirmEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmEmailMutation, { data, loading, error }] = useConfirmEmailMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useConfirmEmailMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmEmailMutation, ConfirmEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmEmailMutation, ConfirmEmailMutationVariables>(ConfirmEmailDocument, options);
      }
export type ConfirmEmailMutationHookResult = ReturnType<typeof useConfirmEmailMutation>;
export type ConfirmEmailMutationResult = Apollo.MutationResult<ConfirmEmailMutation>;
export type ConfirmEmailMutationOptions = Apollo.BaseMutationOptions<ConfirmEmailMutation, ConfirmEmailMutationVariables>;
export const ExpensesListDocument = gql`
    query ExpensesList($date: String!, $scope: ScopeMode, $groupId: ID) {
  expenses(filter: {date: $date}, scope: $scope, groupId: $groupId) {
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
 *      scope: // value for 'scope'
 *      groupId: // value for 'groupId'
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
    query ChartExpensesList($date: String!, $scope: ScopeMode, $groupId: ID) {
  chartExpenses(filter: {date: $date}, scope: $scope, groupId: $groupId) {
    monthlyTotals
    monthlyBudgets
    sharedMonthlyByUser {
      userId
      name
      monthlyTotals
      total
    }
    categoryExpenseTotals {
      categoryName
      subcategoryName
      total
    }
  }
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
 *      scope: // value for 'scope'
 *      groupId: // value for 'groupId'
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
    mutation CreateExpense($subcategoryId: ID!, $amount: Int!, $description: String, $date: String!, $paidByUserId: ID) {
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
 *      description: // value for 'description'
 *      date: // value for 'date'
 *      paidByUserId: // value for 'paidByUserId'
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
    mutation UpdateExpense($id: ID!, $subcategoryId: ID!, $amount: Int!, $description: String, $date: String!, $paidByUserId: ID) {
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
 *      description: // value for 'description'
 *      date: // value for 'date'
 *      paidByUserId: // value for 'paidByUserId'
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
export const GoogleLoginDocument = gql`
    mutation GoogleLogin($code: String!) {
  googleLogin(code: $code) {
    token
    user {
      id
      email
      name
      picture
      provider
    }
  }
}
    `;
export type GoogleLoginMutationFn = Apollo.MutationFunction<GoogleLoginMutation, GoogleLoginMutationVariables>;

/**
 * __useGoogleLoginMutation__
 *
 * To run a mutation, you first call `useGoogleLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGoogleLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [googleLoginMutation, { data, loading, error }] = useGoogleLoginMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useGoogleLoginMutation(baseOptions?: Apollo.MutationHookOptions<GoogleLoginMutation, GoogleLoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GoogleLoginMutation, GoogleLoginMutationVariables>(GoogleLoginDocument, options);
      }
export type GoogleLoginMutationHookResult = ReturnType<typeof useGoogleLoginMutation>;
export type GoogleLoginMutationResult = Apollo.MutationResult<GoogleLoginMutation>;
export type GoogleLoginMutationOptions = Apollo.BaseMutationOptions<GoogleLoginMutation, GoogleLoginMutationVariables>;
export const InsightsDocument = gql`
    query Insights($date: String!, $scope: ScopeMode, $groupId: ID) {
  insights(date: $date, scope: $scope, groupId: $groupId) {
    daysElapsed
    daysInMonth
    totalBudget
    totalSpent
    totalProjected
    totalSafeToSpend
    currentMonthTotal
    previousMonthTotal
    monthOverMonthDelta
    monthOverMonthPercent
    pace {
      categoryId
      categoryName
      budget
      spent
      projected
      safeToSpend
      percentUsed
    }
    biggestMovers {
      categoryId
      categoryName
      currentTotal
      previousTotal
      delta
      percentChange
    }
    topExpenses {
      id
      amount
      description
      date
      subcategoryName
      categoryName
      paidByName
    }
    streaks {
      subcategoryId
      subcategoryName
      categoryName
      monthsUnderBudget
    }
    sharedTotalsByUser {
      userId
      name
      spent
    }
    sharedSplits {
      subcategoryId
      subcategoryName
      categoryName
      total
      perUser {
        userId
        name
        spent
      }
    }
  }
}
    `;

/**
 * __useInsightsQuery__
 *
 * To run a query within a React component, call `useInsightsQuery` and pass it any options that fit your needs.
 * When your component renders, `useInsightsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInsightsQuery({
 *   variables: {
 *      date: // value for 'date'
 *      scope: // value for 'scope'
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useInsightsQuery(baseOptions: Apollo.QueryHookOptions<InsightsQuery, InsightsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InsightsQuery, InsightsQueryVariables>(InsightsDocument, options);
      }
export function useInsightsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InsightsQuery, InsightsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InsightsQuery, InsightsQueryVariables>(InsightsDocument, options);
        }
export type InsightsQueryHookResult = ReturnType<typeof useInsightsQuery>;
export type InsightsLazyQueryHookResult = ReturnType<typeof useInsightsLazyQuery>;
export type InsightsQueryResult = Apollo.QueryResult<InsightsQuery, InsightsQueryVariables>;
export const InvestmentsListDocument = gql`
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

/**
 * __useInvestmentsListQuery__
 *
 * To run a query within a React component, call `useInvestmentsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useInvestmentsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInvestmentsListQuery({
 *   variables: {
 *   },
 * });
 */
export function useInvestmentsListQuery(baseOptions?: Apollo.QueryHookOptions<InvestmentsListQuery, InvestmentsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InvestmentsListQuery, InvestmentsListQueryVariables>(InvestmentsListDocument, options);
      }
export function useInvestmentsListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InvestmentsListQuery, InvestmentsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InvestmentsListQuery, InvestmentsListQueryVariables>(InvestmentsListDocument, options);
        }
export type InvestmentsListQueryHookResult = ReturnType<typeof useInvestmentsListQuery>;
export type InvestmentsListLazyQueryHookResult = ReturnType<typeof useInvestmentsListLazyQuery>;
export type InvestmentsListQueryResult = Apollo.QueryResult<InvestmentsListQuery, InvestmentsListQueryVariables>;
export const CreateInvestmentDocument = gql`
    mutation CreateInvestment($input: CreateInvestmentInput!) {
  createInvestment(input: $input) {
    id
    name
    initialAmount
    currency
  }
}
    `;
export type CreateInvestmentMutationFn = Apollo.MutationFunction<CreateInvestmentMutation, CreateInvestmentMutationVariables>;

/**
 * __useCreateInvestmentMutation__
 *
 * To run a mutation, you first call `useCreateInvestmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInvestmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInvestmentMutation, { data, loading, error }] = useCreateInvestmentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateInvestmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateInvestmentMutation, CreateInvestmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInvestmentMutation, CreateInvestmentMutationVariables>(CreateInvestmentDocument, options);
      }
export type CreateInvestmentMutationHookResult = ReturnType<typeof useCreateInvestmentMutation>;
export type CreateInvestmentMutationResult = Apollo.MutationResult<CreateInvestmentMutation>;
export type CreateInvestmentMutationOptions = Apollo.BaseMutationOptions<CreateInvestmentMutation, CreateInvestmentMutationVariables>;
export const UpdateInvestmentDocument = gql`
    mutation UpdateInvestment($input: UpdateInvestmentInput!) {
  updateInvestment(input: $input) {
    id
    name
  }
}
    `;
export type UpdateInvestmentMutationFn = Apollo.MutationFunction<UpdateInvestmentMutation, UpdateInvestmentMutationVariables>;

/**
 * __useUpdateInvestmentMutation__
 *
 * To run a mutation, you first call `useUpdateInvestmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateInvestmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateInvestmentMutation, { data, loading, error }] = useUpdateInvestmentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateInvestmentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInvestmentMutation, UpdateInvestmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInvestmentMutation, UpdateInvestmentMutationVariables>(UpdateInvestmentDocument, options);
      }
export type UpdateInvestmentMutationHookResult = ReturnType<typeof useUpdateInvestmentMutation>;
export type UpdateInvestmentMutationResult = Apollo.MutationResult<UpdateInvestmentMutation>;
export type UpdateInvestmentMutationOptions = Apollo.BaseMutationOptions<UpdateInvestmentMutation, UpdateInvestmentMutationVariables>;
export const DeleteInvestmentDocument = gql`
    mutation DeleteInvestment($id: ID!) {
  deleteInvestment(id: $id)
}
    `;
export type DeleteInvestmentMutationFn = Apollo.MutationFunction<DeleteInvestmentMutation, DeleteInvestmentMutationVariables>;

/**
 * __useDeleteInvestmentMutation__
 *
 * To run a mutation, you first call `useDeleteInvestmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteInvestmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteInvestmentMutation, { data, loading, error }] = useDeleteInvestmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteInvestmentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteInvestmentMutation, DeleteInvestmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteInvestmentMutation, DeleteInvestmentMutationVariables>(DeleteInvestmentDocument, options);
      }
export type DeleteInvestmentMutationHookResult = ReturnType<typeof useDeleteInvestmentMutation>;
export type DeleteInvestmentMutationResult = Apollo.MutationResult<DeleteInvestmentMutation>;
export type DeleteInvestmentMutationOptions = Apollo.BaseMutationOptions<DeleteInvestmentMutation, DeleteInvestmentMutationVariables>;
export const SignupDocument = gql`
    mutation Signup($email: String!, $password: String!) {
  signup(email: $email, password: $password) {
    token
    user {
      id
      email
      name
      picture
      provider
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
      id
      email
      name
      picture
      provider
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
export const GoogleAuthUrlDocument = gql`
    query GoogleAuthUrl {
  googleAuthUrl {
    url
  }
}
    `;

/**
 * __useGoogleAuthUrlQuery__
 *
 * To run a query within a React component, call `useGoogleAuthUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useGoogleAuthUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGoogleAuthUrlQuery({
 *   variables: {
 *   },
 * });
 */
export function useGoogleAuthUrlQuery(baseOptions?: Apollo.QueryHookOptions<GoogleAuthUrlQuery, GoogleAuthUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GoogleAuthUrlQuery, GoogleAuthUrlQueryVariables>(GoogleAuthUrlDocument, options);
      }
export function useGoogleAuthUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GoogleAuthUrlQuery, GoogleAuthUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GoogleAuthUrlQuery, GoogleAuthUrlQueryVariables>(GoogleAuthUrlDocument, options);
        }
export type GoogleAuthUrlQueryHookResult = ReturnType<typeof useGoogleAuthUrlQuery>;
export type GoogleAuthUrlLazyQueryHookResult = ReturnType<typeof useGoogleAuthUrlLazyQuery>;
export type GoogleAuthUrlQueryResult = Apollo.QueryResult<GoogleAuthUrlQuery, GoogleAuthUrlQueryVariables>;
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
export const UpdateUserDocument = gql`
    mutation UpdateUser($id: ID!, $currency: String!, $weeklyReminder: Boolean!) {
  updateUser(id: $id, currency: $currency, weeklyReminder: $weeklyReminder) {
    email
    currency
    weeklyReminder
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *      currency: // value for 'currency'
 *      weeklyReminder: // value for 'weeklyReminder'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const DeleteAccountDocument = gql`
    mutation DeleteAccount {
  deleteAccount
}
    `;
export type DeleteAccountMutationFn = Apollo.MutationFunction<DeleteAccountMutation, DeleteAccountMutationVariables>;

/**
 * __useDeleteAccountMutation__
 *
 * To run a mutation, you first call `useDeleteAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAccountMutation, { data, loading, error }] = useDeleteAccountMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteAccountMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAccountMutation, DeleteAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(DeleteAccountDocument, options);
      }
export type DeleteAccountMutationHookResult = ReturnType<typeof useDeleteAccountMutation>;
export type DeleteAccountMutationResult = Apollo.MutationResult<DeleteAccountMutation>;
export type DeleteAccountMutationOptions = Apollo.BaseMutationOptions<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const GenerateReportDocument = gql`
    query GenerateReport($year: Int!) {
  generateReport(year: $year)
}
    `;

/**
 * __useGenerateReportQuery__
 *
 * To run a query within a React component, call `useGenerateReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGenerateReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGenerateReportQuery({
 *   variables: {
 *      year: // value for 'year'
 *   },
 * });
 */
export function useGenerateReportQuery(baseOptions: Apollo.QueryHookOptions<GenerateReportQuery, GenerateReportQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GenerateReportQuery, GenerateReportQueryVariables>(GenerateReportDocument, options);
      }
export function useGenerateReportLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GenerateReportQuery, GenerateReportQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GenerateReportQuery, GenerateReportQueryVariables>(GenerateReportDocument, options);
        }
export type GenerateReportQueryHookResult = ReturnType<typeof useGenerateReportQuery>;
export type GenerateReportLazyQueryHookResult = ReturnType<typeof useGenerateReportLazyQuery>;
export type GenerateReportQueryResult = Apollo.QueryResult<GenerateReportQuery, GenerateReportQueryVariables>;
export const GenerateCsvReportDocument = gql`
    query GenerateCsvReport($year: Int!) {
  generateCsvReport(year: $year)
}
    `;

/**
 * __useGenerateCsvReportQuery__
 *
 * To run a query within a React component, call `useGenerateCsvReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGenerateCsvReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGenerateCsvReportQuery({
 *   variables: {
 *      year: // value for 'year'
 *   },
 * });
 */
export function useGenerateCsvReportQuery(baseOptions: Apollo.QueryHookOptions<GenerateCsvReportQuery, GenerateCsvReportQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GenerateCsvReportQuery, GenerateCsvReportQueryVariables>(GenerateCsvReportDocument, options);
      }
export function useGenerateCsvReportLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GenerateCsvReportQuery, GenerateCsvReportQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GenerateCsvReportQuery, GenerateCsvReportQueryVariables>(GenerateCsvReportDocument, options);
        }
export type GenerateCsvReportQueryHookResult = ReturnType<typeof useGenerateCsvReportQuery>;
export type GenerateCsvReportLazyQueryHookResult = ReturnType<typeof useGenerateCsvReportLazyQuery>;
export type GenerateCsvReportQueryResult = Apollo.QueryResult<GenerateCsvReportQuery, GenerateCsvReportQueryVariables>;
export const GenerateDataExportDocument = gql`
    query GenerateDataExport {
  generateDataExport
}
    `;

/**
 * __useGenerateDataExportQuery__
 *
 * To run a query within a React component, call `useGenerateDataExportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGenerateDataExportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGenerateDataExportQuery({
 *   variables: {
 *   },
 * });
 */
export function useGenerateDataExportQuery(baseOptions?: Apollo.QueryHookOptions<GenerateDataExportQuery, GenerateDataExportQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GenerateDataExportQuery, GenerateDataExportQueryVariables>(GenerateDataExportDocument, options);
      }
export function useGenerateDataExportLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GenerateDataExportQuery, GenerateDataExportQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GenerateDataExportQuery, GenerateDataExportQueryVariables>(GenerateDataExportDocument, options);
        }
export type GenerateDataExportQueryHookResult = ReturnType<typeof useGenerateDataExportQuery>;
export type GenerateDataExportLazyQueryHookResult = ReturnType<typeof useGenerateDataExportLazyQuery>;
export type GenerateDataExportQueryResult = Apollo.QueryResult<GenerateDataExportQuery, GenerateDataExportQueryVariables>;
export const ImportDataDocument = gql`
    mutation ImportData($payload: String!, $mode: ImportMode!) {
  importData(payload: $payload, mode: $mode) {
    categories
    subcategories
    expenses
    savingGoals
    investments
  }
}
    `;
export type ImportDataMutationFn = Apollo.MutationFunction<ImportDataMutation, ImportDataMutationVariables>;

/**
 * __useImportDataMutation__
 *
 * To run a mutation, you first call `useImportDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useImportDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [importDataMutation, { data, loading, error }] = useImportDataMutation({
 *   variables: {
 *      payload: // value for 'payload'
 *      mode: // value for 'mode'
 *   },
 * });
 */
export function useImportDataMutation(baseOptions?: Apollo.MutationHookOptions<ImportDataMutation, ImportDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ImportDataMutation, ImportDataMutationVariables>(ImportDataDocument, options);
      }
export type ImportDataMutationHookResult = ReturnType<typeof useImportDataMutation>;
export type ImportDataMutationResult = Apollo.MutationResult<ImportDataMutation>;
export type ImportDataMutationOptions = Apollo.BaseMutationOptions<ImportDataMutation, ImportDataMutationVariables>;
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
export const SavingGoalsListDocument = gql`
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

/**
 * __useSavingGoalsListQuery__
 *
 * To run a query within a React component, call `useSavingGoalsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useSavingGoalsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSavingGoalsListQuery({
 *   variables: {
 *   },
 * });
 */
export function useSavingGoalsListQuery(baseOptions?: Apollo.QueryHookOptions<SavingGoalsListQuery, SavingGoalsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SavingGoalsListQuery, SavingGoalsListQueryVariables>(SavingGoalsListDocument, options);
      }
export function useSavingGoalsListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SavingGoalsListQuery, SavingGoalsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SavingGoalsListQuery, SavingGoalsListQueryVariables>(SavingGoalsListDocument, options);
        }
export type SavingGoalsListQueryHookResult = ReturnType<typeof useSavingGoalsListQuery>;
export type SavingGoalsListLazyQueryHookResult = ReturnType<typeof useSavingGoalsListLazyQuery>;
export type SavingGoalsListQueryResult = Apollo.QueryResult<SavingGoalsListQuery, SavingGoalsListQueryVariables>;
export const CreateSavingGoalDocument = gql`
    mutation CreateSavingGoal($name: String!, $goalDate: String!, $goalAmount: Int!, $initialSaveAmount: Int) {
  createSavingGoal(
    name: $name
    goalDate: $goalDate
    goalAmount: $goalAmount
    initialSaveAmount: $initialSaveAmount
  ) {
    name
    goalAmount
    goalDate
  }
}
    `;
export type CreateSavingGoalMutationFn = Apollo.MutationFunction<CreateSavingGoalMutation, CreateSavingGoalMutationVariables>;

/**
 * __useCreateSavingGoalMutation__
 *
 * To run a mutation, you first call `useCreateSavingGoalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSavingGoalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSavingGoalMutation, { data, loading, error }] = useCreateSavingGoalMutation({
 *   variables: {
 *      name: // value for 'name'
 *      goalDate: // value for 'goalDate'
 *      goalAmount: // value for 'goalAmount'
 *      initialSaveAmount: // value for 'initialSaveAmount'
 *   },
 * });
 */
export function useCreateSavingGoalMutation(baseOptions?: Apollo.MutationHookOptions<CreateSavingGoalMutation, CreateSavingGoalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSavingGoalMutation, CreateSavingGoalMutationVariables>(CreateSavingGoalDocument, options);
      }
export type CreateSavingGoalMutationHookResult = ReturnType<typeof useCreateSavingGoalMutation>;
export type CreateSavingGoalMutationResult = Apollo.MutationResult<CreateSavingGoalMutation>;
export type CreateSavingGoalMutationOptions = Apollo.BaseMutationOptions<CreateSavingGoalMutation, CreateSavingGoalMutationVariables>;
export const UpdateSavingGoalDocument = gql`
    mutation UpdateSavingGoal($id: ID!, $name: String!, $goalDate: String!, $goalAmount: Int!, $initialSaveAmount: Int) {
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
export type UpdateSavingGoalMutationFn = Apollo.MutationFunction<UpdateSavingGoalMutation, UpdateSavingGoalMutationVariables>;

/**
 * __useUpdateSavingGoalMutation__
 *
 * To run a mutation, you first call `useUpdateSavingGoalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSavingGoalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSavingGoalMutation, { data, loading, error }] = useUpdateSavingGoalMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      goalDate: // value for 'goalDate'
 *      goalAmount: // value for 'goalAmount'
 *      initialSaveAmount: // value for 'initialSaveAmount'
 *   },
 * });
 */
export function useUpdateSavingGoalMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSavingGoalMutation, UpdateSavingGoalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSavingGoalMutation, UpdateSavingGoalMutationVariables>(UpdateSavingGoalDocument, options);
      }
export type UpdateSavingGoalMutationHookResult = ReturnType<typeof useUpdateSavingGoalMutation>;
export type UpdateSavingGoalMutationResult = Apollo.MutationResult<UpdateSavingGoalMutation>;
export type UpdateSavingGoalMutationOptions = Apollo.BaseMutationOptions<UpdateSavingGoalMutation, UpdateSavingGoalMutationVariables>;
export const DeleteSavingGoalDocument = gql`
    mutation DeleteSavingGoal($id: ID!) {
  deleteSavingGoal(id: $id) {
    name
  }
}
    `;
export type DeleteSavingGoalMutationFn = Apollo.MutationFunction<DeleteSavingGoalMutation, DeleteSavingGoalMutationVariables>;

/**
 * __useDeleteSavingGoalMutation__
 *
 * To run a mutation, you first call `useDeleteSavingGoalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSavingGoalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSavingGoalMutation, { data, loading, error }] = useDeleteSavingGoalMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSavingGoalMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSavingGoalMutation, DeleteSavingGoalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSavingGoalMutation, DeleteSavingGoalMutationVariables>(DeleteSavingGoalDocument, options);
      }
export type DeleteSavingGoalMutationHookResult = ReturnType<typeof useDeleteSavingGoalMutation>;
export type DeleteSavingGoalMutationResult = Apollo.MutationResult<DeleteSavingGoalMutation>;
export type DeleteSavingGoalMutationOptions = Apollo.BaseMutationOptions<DeleteSavingGoalMutation, DeleteSavingGoalMutationVariables>;