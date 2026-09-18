/**
 * Applies the app's mutations to the demo's working copy.
 *
 * The demo is writable on purpose: a tour that says "adding an expense moves
 * your budget" and then cannot add one is a slideshow. Writes land in
 * localStorage and nowhere else, so nothing here can reach the database or
 * another person's data, and exiting the demo discards every one of them.
 *
 * Each handler returns the next state plus the payload the calling document
 * selects. Queries recompute from that state, so no response needs patching by
 * hand.
 */
import { parseMonthStartUTC } from "./budget-periods";
import { DemoExpense, DemoState } from "./demo-dataset";

const epoch = (date: Date) => String(date.getTime());

let sequence = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now()}-${sequence++}`;

/**
 * Surfaced to the user as an ordinary GraphQL error, which is how the existing
 * forms already report failures — no demo-specific error handling needed.
 */
export class DemoUnsupportedError extends Error {}

const unsupported = (what: string): never => {
  throw new DemoUnsupportedError(
    `${what} is not part of the demo. Exit the demo to do this for real.`,
  );
};

interface Applied {
  state: DemoState;
  data: object;
}

type Handler = (state: DemoState, variables: any) => Applied;

/** Rebuilds a subcategory's schedule and the two columns cached off it. */
const withBudgets = (
  state: DemoState,
  subcategoryId: string,
  budgets: { id: string; amount: number; validFrom: Date }[],
): DemoState => ({
  ...state,
  categories: state.categories.map((category) => ({
    ...category,
    subcategories: category.subcategories.map((subcategory) =>
      subcategory.id === subcategoryId
        ? {
            ...subcategory,
            budgets: [...budgets].sort(
              (a, b) => a.validFrom.getTime() - b.validFrom.getTime(),
            ),
          }
        : subcategory,
    ),
  })),
});

const findSubcategory = (state: DemoState, subcategoryId: string) =>
  state.categories
    .flatMap((category) => category.subcategories)
    .find((subcategory) => subcategory.id === subcategoryId);

const shapeSubcategoryWithBudgets = (state: DemoState, subcategoryId: string) => {
  const subcategory = findSubcategory(state, subcategoryId);
  if (!subcategory) return unsupported("That subcategory");

  return {
    __typename: "Subcategory",
    id: subcategory.id,
    // The amount in force today, mirroring the server's cached column.
    budgetAmount:
      [...subcategory.budgets]
        .reverse()
        .find((budget) => budget.validFrom <= new Date())?.amount ??
      subcategory.budgets[0]?.amount ??
      0,
    rolloverDate: epoch(subcategory.budgets[0]?.validFrom ?? new Date()),
    budgets: subcategory.budgets.map((budget) => ({
      __typename: "SubcategoryBudget",
      id: budget.id,
      amount: budget.amount,
      validFrom: epoch(budget.validFrom),
    })),
  };
};

const shapeExpense = (expense: DemoExpense) => ({
  __typename: "Expense",
  id: expense.id,
  amount: expense.amount,
  description: expense.description,
  date: epoch(expense.date),
  paidBy: { __typename: "User", id: expense.userId },
});

/** The pages send `MM-DD-YYYY`; the demo keeps expense dates in local time. */
const parseExpenseDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new Error(`Invalid date: ${value}`);
  return parsed;
};

const MUTATIONS: Record<string, Handler> = {
  CreateExpense: (state, variables) => {
    const expense: DemoExpense = {
      id: nextId("demo-expense"),
      subcategoryId: variables.subcategoryId,
      amount: variables.amount,
      description: variables.description ?? null,
      date: parseExpenseDate(variables.date),
      userId: variables.paidByUserId || state.viewerId,
    };

    return {
      state: { ...state, expenses: [...state.expenses, expense] },
      data: { createExpense: shapeExpense(expense) },
    };
  },

  UpdateExpense: (state, variables) => {
    let updated: DemoExpense | undefined;

    const expenses = state.expenses.map((expense) => {
      if (expense.id !== variables.id) return expense;
      updated = {
        ...expense,
        subcategoryId: variables.subcategoryId ?? expense.subcategoryId,
        amount: variables.amount,
        description: variables.description ?? null,
        date: parseExpenseDate(variables.date),
        userId: variables.paidByUserId || expense.userId,
      };
      return updated;
    });

    if (!updated) return unsupported("That expense");
    return { state: { ...state, expenses }, data: { updateExpense: shapeExpense(updated) } };
  },

  DeleteExpense: (state, variables) => ({
    state: {
      ...state,
      expenses: state.expenses.filter((expense) => expense.id !== variables.id),
    },
    data: { deleteExpense: { __typename: "Expense", id: variables.id } },
  }),

  CreateCategory: (state, variables) => {
    const category = {
      id: nextId("demo-category"),
      name: variables.name,
      // New categories are personal, exactly as they are for a real account.
      groupId: null,
      subcategories: [],
    };

    return {
      state: { ...state, categories: [...state.categories, category] },
      data: {
        createCategory: {
          __typename: "Category",
          id: category.id,
          name: category.name,
        },
      },
    };
  },

  UpdateCategory: (state, variables) => ({
    state: {
      ...state,
      categories: state.categories.map((category) =>
        category.id === variables.id
          ? { ...category, name: variables.name }
          : category,
      ),
    },
    data: {
      updateCategory: {
        __typename: "Category",
        id: variables.id,
        name: variables.name,
      },
    },
  }),

  DeleteCategory: (state, variables) => {
    const category = state.categories.find((c) => c.id === variables.id);
    if (!category) return unsupported("That category");

    const orphaned = new Set(category.subcategories.map((s) => s.id));

    return {
      state: {
        ...state,
        categories: state.categories.filter((c) => c.id !== variables.id),
        // Expenses would otherwise survive their subcategory and keep counting
        // towards totals that no longer have a row to show them on.
        expenses: state.expenses.filter((e) => !orphaned.has(e.subcategoryId)),
      },
      data: {
        deleteCategory: { __typename: "Category", name: category.name },
      },
    };
  },

  CreateSubcategory: (state, variables) => {
    const validFrom = parseMonthStartUTC(variables.validFrom);
    const id = nextId("demo-subcategory");

    const subcategory = {
      id,
      categoryId: variables.categoryId,
      name: variables.name,
      createdAt: validFrom,
      budgets: [
        { id: `${id}-budget-0`, amount: variables.budgetAmount, validFrom },
      ],
    };

    return {
      state: {
        ...state,
        categories: state.categories.map((category) =>
          category.id === variables.categoryId
            ? {
                ...category,
                subcategories: [...category.subcategories, subcategory],
              }
            : category,
        ),
      },
      data: {
        createSubcategory: {
          __typename: "Subcategory",
          id,
          categoryId: variables.categoryId,
          name: variables.name,
          budgetAmount: variables.budgetAmount,
        },
      },
    };
  },

  UpdateSubcategory: (state, variables) => {
    const existing = findSubcategory(state, variables.id);
    if (!existing) return unsupported("That subcategory");

    // Re-filing moves the row between categories, so it is removed everywhere
    // and re-added under the target rather than edited in place.
    const moved = {
      ...existing,
      categoryId: variables.categoryId,
      name: variables.name,
    };

    return {
      state: {
        ...state,
        categories: state.categories.map((category) => {
          const without = category.subcategories.filter(
            (subcategory) => subcategory.id !== variables.id,
          );
          return {
            ...category,
            subcategories:
              category.id === variables.categoryId
                ? [...without, moved]
                : without,
          };
        }),
      },
      data: {
        updateSubcategory: {
          __typename: "Subcategory",
          id: moved.id,
          categoryId: moved.categoryId,
          name: moved.name,
          budgetAmount: moved.budgets.at(-1)?.amount ?? 0,
        },
      },
    };
  },

  DeleteSubcategory: (state, variables) => {
    const existing = findSubcategory(state, variables.id);
    if (!existing) return unsupported("That subcategory");

    return {
      state: {
        ...state,
        categories: state.categories.map((category) => ({
          ...category,
          subcategories: category.subcategories.filter(
            (subcategory) => subcategory.id !== variables.id,
          ),
        })),
        expenses: state.expenses.filter(
          (expense) => expense.subcategoryId !== variables.id,
        ),
      },
      data: {
        deleteSubcategory: { __typename: "Subcategory", name: existing.name },
      },
    };
  },

  SetSubcategoryBudget: (state, variables) => {
    const existing = findSubcategory(state, variables.subcategoryId);
    if (!existing) return unsupported("That subcategory");

    const validFrom = parseMonthStartUTC(variables.validFrom);
    // Upsert, not append: setting the same month twice is the user correcting
    // the figure they just entered, not a second period.
    const replaced = existing.budgets.some(
      (budget) => budget.validFrom.getTime() === validFrom.getTime(),
    );

    const budgets = replaced
      ? existing.budgets.map((budget) =>
          budget.validFrom.getTime() === validFrom.getTime()
            ? { ...budget, amount: variables.amount }
            : budget,
        )
      : [
          ...existing.budgets,
          {
            id: nextId(`${existing.id}-budget`),
            amount: variables.amount,
            validFrom,
          },
        ];

    const next = withBudgets(state, existing.id, budgets);
    return {
      state: next,
      data: { setSubcategoryBudget: shapeSubcategoryWithBudgets(next, existing.id) },
    };
  },

  DeleteSubcategoryBudget: (state, variables) => {
    const existing = findSubcategory(state, variables.subcategoryId);
    if (!existing) return unsupported("That subcategory");

    // Removing the last one leaves no budget in any month, which the UI has no
    // way to show and no way to undo.
    if (existing.budgets.length <= 1) {
      throw new Error("A subcategory needs at least one budget period");
    }

    const validFrom = parseMonthStartUTC(variables.validFrom);
    const budgets = existing.budgets.filter(
      (budget) => budget.validFrom.getTime() !== validFrom.getTime(),
    );

    if (budgets.length === existing.budgets.length) {
      throw new Error("No budget period starts in that month");
    }

    const next = withBudgets(state, existing.id, budgets);
    return {
      state: next,
      data: {
        deleteSubcategoryBudget: shapeSubcategoryWithBudgets(next, existing.id),
      },
    };
  },

  CreateSavingGoal: (state, variables) => {
    const goal = {
      id: nextId("demo-goal"),
      name: variables.name,
      goalAmount: variables.goalAmount,
      initialSaveAmount: variables.initialSaveAmount ?? 0,
      goalDate: new Date(variables.goalDate),
      createdAt: new Date(),
    };

    return {
      state: { ...state, savingGoals: [...state.savingGoals, goal] },
      data: {
        createSavingGoal: {
          __typename: "SavingGoal",
          name: goal.name,
          goalAmount: goal.goalAmount,
          goalDate: epoch(goal.goalDate),
        },
      },
    };
  },

  UpdateSavingGoal: (state, variables) => ({
    state: {
      ...state,
      savingGoals: state.savingGoals.map((goal) =>
        goal.id === variables.id
          ? {
              ...goal,
              name: variables.name,
              goalAmount: variables.goalAmount,
              initialSaveAmount: variables.initialSaveAmount ?? 0,
              goalDate: new Date(variables.goalDate),
            }
          : goal,
      ),
    },
    data: {
      updateSavingGoal: { __typename: "SavingGoal", name: variables.name },
    },
  }),

  DeleteSavingGoal: (state, variables) => {
    const goal = state.savingGoals.find((g) => g.id === variables.id);
    if (!goal) return unsupported("That saving goal");

    return {
      state: {
        ...state,
        savingGoals: state.savingGoals.filter((g) => g.id !== variables.id),
      },
      data: {
        deleteSavingGoal: { __typename: "SavingGoal", name: goal.name },
      },
    };
  },
};

/*
 * Anything not in that table is refused, never forwarded.
 *
 * An allow-list is the only safe default here: a mutation that fell through to
 * the network during a demo would be a real write to a real account, and the
 * list of mutations grows over time while this file does not. Group membership
 * and account settings are the deliberate refusals — an invitation that appears
 * to send but does not is worse than a button that says why it cannot.
 */
export const resolveDemoMutation = (
  operationName: string,
  state: DemoState,
  variables: Record<string, any>,
): Applied => {
  const handler = MUTATIONS[operationName];

  if (!handler) {
    return unsupported(
      operationName.startsWith("Invite") ||
        operationName.includes("Group") ||
        operationName.includes("Member")
        ? "Changing your household"
        : "That",
    );
  }

  return handler(state, variables ?? {});
};
