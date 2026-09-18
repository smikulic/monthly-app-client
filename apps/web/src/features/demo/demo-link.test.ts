import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ApolloLink, Observable, execute, gql } from "@apollo/client";
import { demoLink } from "./demo-link";
import { materialiseDemoDataset, StoredDemoDataset } from "./demo-dataset";
import { exitDemo, getDemoState, startDemo } from "./demo-store";

/**
 * The promise the demo banner makes on the user's behalf is that nothing they
 * do in a demo touches their account. That promise is kept in exactly one
 * place — this link — so it is worth pinning down rather than assuming.
 */

const dataset: StoredDemoDataset = {
  schemaVersion: 1,
  currency: "EUR",
  viewerId: "u1",
  users: [{ id: "u1", name: "You", email: "you@example.com" }],
  groups: [],
  categories: [
    {
      id: "c1",
      name: "Food",
      groupId: null,
      subcategories: [
        { id: "s1", name: "Groceries", budgets: [{ monthOffset: 0, amount: 400 }] },
      ],
    },
  ],
  expenses: [],
  savingGoals: [],
  investments: [],
};

/** Records anything that made it past the demo link towards the network. */
const forwarded: string[] = [];
const terminating = new ApolloLink((operation) => {
  forwarded.push(operation.operationName);
  return Observable.of({ data: { ok: true } });
});

const link = ApolloLink.from([demoLink, terminating]);

const run = (document: any, variables: Record<string, unknown> = {}) =>
  new Promise<any>((resolve, reject) =>
    execute(link, { query: document, variables }).subscribe({
      next: resolve,
      error: reject,
    }),
  );

const CREATE_EXPENSE = gql`
  mutation CreateExpense($subcategoryId: ID!, $amount: Int!, $date: String!) {
    createExpense(
      subcategoryId: $subcategoryId
      amount: $amount
      date: $date
    ) {
      id
      amount
    }
  }
`;

const DELETE_ACCOUNT = gql`
  mutation DeleteAccount {
    deleteAccount
  }
`;

const MARK_SEEN = gql`
  mutation MarkOnboardingSeen {
    markOnboardingSeen {
      id
    }
  }
`;

const GENERATE_REPORT = gql`
  query GenerateReport($year: Int!) {
    generateReport(year: $year)
  }
`;

beforeEach(() => {
  forwarded.length = 0;
  // A real demo session, written the way the app writes it.
  vi.setSystemTime(new Date(2026, 5, 15));
  startDemo(dataset, 1);
});

afterEach(() => {
  exitDemo();
  vi.useRealTimers();
});

describe("while a demo is running", () => {
  it("applies a write locally instead of sending it", async () => {
    const result = await run(CREATE_EXPENSE, {
      subcategoryId: "s1",
      amount: 42,
      date: "06-15-2026",
    });

    expect(result.data.createExpense.amount).toBe(42);
    expect(forwarded).toEqual([]);
    expect(getDemoState()?.expenses).toHaveLength(1);
  });

  it("refuses a write it cannot apply rather than forwarding it", async () => {
    await expect(run(DELETE_ACCOUNT)).rejects.toThrow(/not part of the demo/);
    expect(forwarded).toEqual([]);
  });

  it("lets the two onboarding mutations through, since they end the demo", async () => {
    await run(MARK_SEEN);
    expect(forwarded).toEqual(["MarkOnboardingSeen"]);
  });

  it("forwards reads about the real account", async () => {
    await run(GENERATE_REPORT, { year: 2026 });
    expect(forwarded).toEqual(["GenerateReport"]);
  });
});

describe("with no demo running", () => {
  it("is not in the way at all", async () => {
    exitDemo();

    await run(CREATE_EXPENSE, {
      subcategoryId: "s1",
      amount: 42,
      date: "06-15-2026",
    });

    expect(forwarded).toEqual(["CreateExpense"]);
  });
});

describe("the cached session", () => {
  it("is dropped once its anchor month has passed", () => {
    expect(getDemoState()).not.toBeNull();

    // Same stored copy, read in a later month: its offsets would now resolve
    // to the wrong months, so it is discarded rather than shown.
    const stale = materialiseDemoDataset(dataset, new Date(2026, 4, 15));
    expect(stale.anchorMonth).toBe("2026-05");
    expect(getDemoState()?.anchorMonth).toBe("2026-06");
  });
});
