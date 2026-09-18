/**
 * The demo dataset as it arrives from the server, and the working copy the
 * demo backend answers queries from.
 *
 * The stored form expresses every date as a `monthOffset` from the month the
 * visitor opens the app in. Materialising those into real dates here is what
 * keeps the demo evergreen: a dataset with absolute dates would be showing a
 * stale year within months, and a demo that looks abandoned is worse than none.
 *
 * The builder is `monthly-app-server/src/demo/demoDataset.ts`.
 */

/** Bumped by the server whenever the payload changes. */
export const DEMO_STORAGE_KEY = "monthly.demo";

export interface StoredDemoUser {
  id: string;
  name: string;
  email: string;
}

export interface StoredDemoDataset {
  schemaVersion: number;
  currency: string;
  /** Which of `users` the visitor is standing in for. */
  viewerId: string;
  users: StoredDemoUser[];
  groups: {
    id: string;
    name: string;
    members: { id: string; userId: string; role: string }[];
    invites: { id: string; email: string; role: string; status: string }[];
  }[];
  categories: {
    id: string;
    name: string;
    groupId: string | null;
    subcategories: {
      id: string;
      name: string;
      budgets: { monthOffset: number; amount: number }[];
    }[];
  }[];
  expenses: {
    subcategoryId: string;
    monthOffset: number;
    day: number;
    amount: number;
    description: string;
    paidById: string;
  }[];
  savingGoals: {
    id: string;
    name: string;
    goalAmount: number;
    initialSaveAmount: number;
    goalMonthOffset: number;
  }[];
  investments: unknown[];
}

export interface DemoSubcategory {
  id: string;
  categoryId: string;
  name: string;
  createdAt: Date;
  /** Sorted ascending by `validFrom`, as the accrual maths requires. */
  budgets: { id: string; amount: number; validFrom: Date }[];
}

export interface DemoCategory {
  id: string;
  name: string;
  groupId: string | null;
  subcategories: DemoSubcategory[];
}

export interface DemoExpense {
  id: string;
  subcategoryId: string;
  amount: number;
  description: string | null;
  /** Local time, matching how the server buckets expenses by month. */
  date: Date;
  userId: string;
}

export interface DemoSavingGoal {
  id: string;
  name: string;
  goalAmount: number;
  initialSaveAmount: number;
  goalDate: Date;
  createdAt: Date;
}

/**
 * The live working copy. Mutations during the demo edit this and nothing else,
 * which is why exiting the demo needs no teardown beyond dropping the key.
 */
export interface DemoState {
  schemaVersion: number;
  currency: string;
  viewerId: string;
  users: StoredDemoUser[];
  groups: StoredDemoDataset["groups"];
  categories: DemoCategory[];
  expenses: DemoExpense[];
  savingGoals: DemoSavingGoal[];
  /** The month the offsets were resolved against, so staleness is detectable. */
  anchorMonth: string;
}

const anchorKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

/** Budget periods are keyed on UTC month starts; expenses are local. */
const offsetToMonthStartUTC = (anchor: Date, offset: number) =>
  new Date(Date.UTC(anchor.getFullYear(), anchor.getMonth() + offset, 1));

const offsetToLocalDate = (anchor: Date, offset: number, day: number) => {
  // Clamped so a 31st in the spec never silently rolls into the next month,
  // which would move an expense out of the month its budget belongs to.
  const monthEnd = new Date(
    anchor.getFullYear(),
    anchor.getMonth() + offset + 1,
    0,
  ).getDate();

  return new Date(
    anchor.getFullYear(),
    anchor.getMonth() + offset,
    Math.min(day, monthEnd),
  );
};

/** Resolves the stored offsets against a month, defaulting to this one. */
export function materialiseDemoDataset(
  stored: StoredDemoDataset,
  now: Date = new Date(),
): DemoState {
  const categories: DemoCategory[] = stored.categories.map((category) => ({
    id: category.id,
    name: category.name,
    groupId: category.groupId,
    subcategories: category.subcategories.map((subcategory) => {
      const budgets = [...subcategory.budgets]
        .sort((a, b) => a.monthOffset - b.monthOffset)
        .map((budget, index) => ({
          id: `${subcategory.id}-budget-${index}`,
          amount: budget.amount,
          validFrom: offsetToMonthStartUTC(now, budget.monthOffset),
        }));

      return {
        id: subcategory.id,
        categoryId: category.id,
        name: subcategory.name,
        createdAt: budgets[0]?.validFrom ?? now,
        budgets,
      };
    }),
  }));

  const expenses: DemoExpense[] = stored.expenses.map((expense, index) => ({
    id: `demo-expense-${index}`,
    subcategoryId: expense.subcategoryId,
    amount: expense.amount,
    description: expense.description,
    date: offsetToLocalDate(now, expense.monthOffset, expense.day),
    userId: expense.paidById,
  }));

  const savingGoals: DemoSavingGoal[] = stored.savingGoals.map((goal) => ({
    id: goal.id,
    name: goal.name,
    goalAmount: goal.goalAmount,
    initialSaveAmount: goal.initialSaveAmount,
    goalDate: offsetToLocalDate(now, goal.goalMonthOffset, 1),
    createdAt: offsetToLocalDate(now, -1, 1),
  }));

  return {
    schemaVersion: stored.schemaVersion,
    currency: stored.currency,
    viewerId: stored.viewerId,
    users: stored.users,
    groups: stored.groups,
    categories,
    expenses,
    savingGoals,
    anchorMonth: anchorKey(now),
  };
}

/**
 * Dates do not survive `JSON.stringify` as dates, so the cached copy is revived
 * on the way back out. Missing the revival would leave every `Date` a string
 * and the accrual maths silently comparing strings.
 */
export const reviveDemoState = (raw: string): DemoState => {
  const parsed = JSON.parse(raw, (key, value) => {
    if (
      (key === "validFrom" ||
        key === "date" ||
        key === "createdAt" ||
        key === "goalDate") &&
      typeof value === "string"
    ) {
      return new Date(value);
    }
    return value;
  });

  return parsed as DemoState;
};

/** True when the cached copy was anchored on an earlier month. */
export const isStale = (state: DemoState, now: Date = new Date()) =>
  state.anchorMonth !== anchorKey(now);
