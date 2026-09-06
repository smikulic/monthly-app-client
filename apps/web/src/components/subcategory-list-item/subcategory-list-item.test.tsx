import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import { describe, expect, it, vi } from "vitest";
import { SubcategoryListItem } from "./subcategory-list-item";
import { GET_ALL_EXPENSES } from "@/pages/expenses-page/expenses-page-queries";
import { SubcategoryDecoratedWithExpenses } from "@/features/expenses/expenses-list/expenses-list";
import { formatAmount } from "@/utils/format";

/*
 * These lock in that the budget schedule actually reaches this component on the
 * expenses page. The chain runs GET_CATEGORIES_LIST -> decoration -> props, and
 * a subcategory with one period produces the same numbers whether the schedule
 * arrives or the flat fallback kicks in, so only a two-period case can tell the
 * two apart.
 */

// Timestamps, which is how the API serialises dates.
const ms = (year: number, month: number) => String(Date.UTC(year, month, 1));

const groceries = {
  id: "sub-1",
  categoryId: "cat-1",
  name: "Groceries",
  createdAt: ms(2023, 5),
  rolloverDate: ms(2023, 5),
  budgetAmount: 700,
  budgets: [
    { id: "p1", amount: 100, validFrom: ms(2023, 5), __typename: "SubcategoryBudget" },
    { id: "p2", amount: 700, validFrom: ms(2026, 0), __typename: "SubcategoryBudget" },
  ],
  expenses: [],
  __typename: "Subcategory",
} as unknown as SubcategoryDecoratedWithExpenses;

const noExpenses = [
  {
    request: { query: GET_ALL_EXPENSES },
    result: { data: { expenses: [] } },
  },
];

/*
 * Intl separates the amount from the currency symbol with a non-breaking space,
 * which does not survive a literal comparison. Matching on the digits alone
 * keeps these tests about the number rather than about formatting.
 */
const strip = (value: string) => value.replace(/\s/g, "");
const amount = (value: number) => (content: string) =>
  strip(content) === strip(formatAmount(value));

const renderAt = (currentDate: Date, showRolloverBudget = false) =>
  render(
    <MockedProvider mocks={noExpenses} addTypename={false}>
      <SubcategoryListItem
        subcategory={groceries}
        subcategorySelected={groceries}
        currentDate={currentDate}
        showRolloverBudget={showRolloverBudget}
        refetchExpenses={vi.fn()}
        setUpdateModalExpense={vi.fn()}
      />
    </MockedProvider>
  );

describe("<SubcategoryListItem /> budget schedule", () => {
  it("reports the amount that applied in the month being viewed", () => {
    // December 2025 is before the raise, so it must still read 100. If the
    // schedule were not reaching the component this would show 700, the
    // denormalised current amount.
    renderAt(new Date(2025, 11, 15));

    expect(screen.getByText(amount(100))).toBeInTheDocument();
    expect(screen.queryByText(amount(700))).not.toBeInTheDocument();
  });

  it("reports the new amount once the raise has started", () => {
    renderAt(new Date(2026, 2, 15));

    expect(screen.getByText(amount(700))).toBeInTheDocument();
  });

  it("accrues each era at its own amount for the rollover figure", () => {
    // Jun 2023 to Dec 2025 is 31 months at 100, Jan to Mar 2026 is 3 at 700.
    // The old single-amount maths would have given 34 * 700 = 23,800.
    renderAt(new Date(2026, 2, 15), true);

    expect(screen.getByText(amount(31 * 100 + 3 * 700))).toBeInTheDocument();
  });
});
