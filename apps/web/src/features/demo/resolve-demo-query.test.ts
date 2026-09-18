import { describe, it, expect } from "vitest";
import { DocumentNode, OperationDefinitionNode, SelectionSetNode } from "graphql";
import { GET_CATEGORIES_LIST } from "@/pages/categories-page/categories-page-queries";
import {
  GET_CHART_EXPENSES_LIST,
  GET_EXPENSES_LIST,
} from "@/pages/expenses-page/expenses-page-queries";
import { GET_INSIGHTS } from "@/pages/insights-page/insights-page-queries";
import { GET_SAVING_GOALS_LIST } from "@/pages/saving-goals-page/saving-goals-page-queries";
import { ME, MY_GROUPS } from "@/features/groups/groups-queries";
import { materialiseDemoDataset, StoredDemoDataset } from "./demo-dataset";
import { resolveDemoQuery } from "./resolve-demo-query";
import { resolveDemoMutation } from "./resolve-demo-mutation";

/**
 * The failure this file exists to prevent: a query gains a field, the demo
 * keeps answering without it, and the page breaks *only* in demo mode — where
 * nobody is looking, because the real app is fine.
 *
 * So rather than asserting against shapes written out by hand, this walks the
 * app's actual GraphQL documents and checks the demo produces every field they
 * ask for. Add a field to a query and this fails until the demo answers it.
 */

const FROZEN = new Date(2026, 5, 15); // mid-month, so "days elapsed" is real

/**
 * Structurally complete rather than rich: the content that makes the demo worth
 * showing is the server's business (`src/demo/demoDataset.ts`). What is checked
 * here is that every branch of every document has something to resolve against
 * — including the shared-household branch, which needs two payers to exist.
 */
const fixture: StoredDemoDataset = {
  schemaVersion: 1,
  currency: "EUR",
  viewerId: "u1",
  users: [
    { id: "u1", name: "You", email: "you@example.com" },
    { id: "u2", name: "Ana", email: "ana@example.com" },
  ],
  groups: [
    {
      id: "g1",
      name: "Household",
      members: [
        { id: "m1", userId: "u1", role: "OWNER" },
        { id: "m2", userId: "u2", role: "MEMBER" },
      ],
      invites: [{ id: "i1", email: "sam@example.com", role: "MEMBER", status: "PENDING" }],
    },
  ],
  categories: [
    {
      id: "c1",
      name: "Food",
      groupId: "g1",
      subcategories: [
        {
          id: "s1",
          name: "Groceries",
          budgets: [
            { monthOffset: -11, amount: 380 },
            { monthOffset: -5, amount: 450 },
          ],
        },
      ],
    },
    {
      id: "c2",
      name: "Transport",
      groupId: null,
      subcategories: [
        { id: "s2", name: "Fuel", budgets: [{ monthOffset: -11, amount: 120 }] },
      ],
    },
  ],
  expenses: [
    { subcategoryId: "s1", monthOffset: 0, day: 3, amount: 120, description: "Shop", paidById: "u1" },
    { subcategoryId: "s1", monthOffset: 0, day: 9, amount: 95, description: "Shop", paidById: "u2" },
    { subcategoryId: "s1", monthOffset: -1, day: 4, amount: 400, description: "Shop", paidById: "u1" },
    { subcategoryId: "s2", monthOffset: 0, day: 6, amount: 60, description: "Fuel", paidById: "u1" },
  ],
  savingGoals: [
    {
      id: "sg1",
      name: "Holiday",
      goalAmount: 2400,
      initialSaveAmount: 1650,
      goalMonthOffset: 6,
    },
  ],
  investments: [],
};

const state = materialiseDemoDataset(fixture, FROZEN);

const dateArg = "06-15-2026";
const variables = { date: dateArg, scope: "ALL", groupId: undefined };

const operationOf = (document: DocumentNode) =>
  document.definitions.find(
    (definition): definition is OperationDefinitionNode =>
      definition.kind === "OperationDefinition",
  )!;

/**
 * Walks a selection set against a resolved value, failing on the first field
 * the demo does not answer. Apollo adds `__typename` to every selection, which
 * is why the demo sets it explicitly everywhere.
 */
const expectSatisfies = (
  selectionSet: SelectionSetNode,
  value: unknown,
  path: string,
) => {
  if (value === null || value === undefined) return;

  if (Array.isArray(value)) {
    // An empty list proves nothing about the shape, and several of these lists
    // are legitimately empty, so only populated ones are walked.
    value.forEach((item, index) =>
      expectSatisfies(selectionSet, item, `${path}[${index}]`),
    );
    return;
  }

  for (const selection of selectionSet.selections) {
    if (selection.kind !== "Field") continue;

    const key = selection.alias?.value ?? selection.name.value;
    const child = (value as Record<string, unknown>)[key];

    expect(
      child,
      `${path}.${key} is selected by the query but the demo does not answer it`,
    ).not.toBeUndefined();

    if (selection.selectionSet) {
      expectSatisfies(selection.selectionSet, child, `${path}.${key}`);
    }
  }
};

const cases: [string, DocumentNode][] = [
  ["MeId", ME],
  ["CategoriesList", GET_CATEGORIES_LIST],
  ["ExpensesList", GET_EXPENSES_LIST],
  ["ChartExpensesList", GET_CHART_EXPENSES_LIST],
  ["Insights", GET_INSIGHTS],
  ["SavingGoalsList", GET_SAVING_GOALS_LIST],
  ["MyGroups", MY_GROUPS],
];

describe("the demo answers every field the app asks for", () => {
  it.each(cases)("%s", (operationName, document) => {
    const data = resolveDemoQuery(operationName, state, variables);
    const operation = operationOf(document);

    // Guards against the documents and the dispatch table drifting apart.
    expect(operation.name?.value).toBe(operationName);
    expectSatisfies(operation.selectionSet, data, operationName);
  });
});

describe("the figures the tour points at", () => {
  it("carries rollover forward across months, not just this one", () => {
    const { categories } = resolveDemoQuery("CategoriesList", state, variables) as any;
    const groceries = categories[0].subcategories[0];

    // Six months at 380 then six at 450 through this month, less 615 spent.
    const accrued = 6 * 380 + 6 * 450;
    expect(groceries.budgetForMonth).toBe(450);
    expect(groceries.rolloverRemaining).toBe(accrued - 615);
  });

  it("reports over budget where the data is over budget", () => {
    const { insights } = resolveDemoQuery("Insights", state, variables) as any;
    const food = insights.pace.find((p: any) => p.categoryName === "Food");

    expect(food.budget).toBe(450);
    expect(food.spent).toBe(215);
    expect(food.safeToSpend).toBe(235);
  });

  it("splits shared spend by who paid, and only for shared categories", () => {
    const { insights } = resolveDemoQuery("Insights", state, variables) as any;

    expect(insights.sharedTotalsByUser).toEqual([
      expect.objectContaining({ name: "You", spent: 120 }),
      expect.objectContaining({ name: "Ana", spent: 95 }),
    ]);
    // Fuel is personal, so its 60 is absent from the split entirely.
    expect(insights.sharedSplits).toHaveLength(1);
    expect(insights.sharedSplits[0].total).toBe(215);
  });
});

describe("writing during the demo", () => {
  it("moves the budget the tour is pointing at", () => {
    const before = resolveDemoQuery("Insights", state, variables) as any;

    const { state: after } = resolveDemoMutation("CreateExpense", state, {
      subcategoryId: "s1",
      amount: 300,
      description: "Big shop",
      date: dateArg,
      paidByUserId: "u1",
    });

    const result = resolveDemoQuery("Insights", after, variables) as any;
    const food = result.insights.pace.find((p: any) => p.categoryName === "Food");

    expect(before.insights.pace.find((p: any) => p.categoryName === "Food").spent).toBe(215);
    expect(food.spent).toBe(515);
    // The point of the step: the same category is now over its 450.
    expect(food.safeToSpend).toBeLessThan(0);
  });

  it("leaves the dataset it was given untouched", () => {
    resolveDemoMutation("CreateExpense", state, {
      subcategoryId: "s1",
      amount: 300,
      date: dateArg,
    });

    expect(state.expenses).toHaveLength(4);
  });

  it("refuses a mutation it does not implement rather than letting it through", () => {
    expect(() =>
      resolveDemoMutation("InviteToGroup", state, {
        groupId: "g1",
        email: "sam@example.com",
      }),
    ).toThrow(/not part of the demo/);
  });
});
