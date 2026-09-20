import { render as rtlRender, screen, fireEvent, within } from "@/test-utils";
import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as gql from "@/generated/graphql";
import { CreateExpenseForm } from "./create-expense-form";
import { SubcategoryDecoratedWithExpenses } from "../expenses-list/expenses-list";

/**
 * Reported from the installed app: fill the form, change "Subcategory" or
 * "Paid by", and Create goes disabled while the fields still look complete.
 */

vi.mock("@/generated/graphql", () => ({
  useCreateExpenseMutation: vi.fn(),
  useMeIdQuery: vi.fn(),
  useMyGroupsQuery: vi.fn(),
}));

const GROUP_ID = "group-1";

const subcategories = [
  { id: "sub-1", name: "Groceries", categoryId: "cat-1" },
  { id: "sub-2", name: "Eating out", categoryId: "cat-1" },
] as unknown as SubcategoryDecoratedWithExpenses[];

const render = () =>
  rtlRender(
    <MockedProvider addTypename={false}>
      <CreateExpenseForm
        open
        subcategories={subcategories}
        categoryGroupId={GROUP_ID}
        currentDate={new Date(2026, 8, 18)}
        closeForm={vi.fn()}
      />
    </MockedProvider>,
  );

const amountField = () =>
  within(screen.getByTestId("expense-amount-input")).getByRole("textbox");

const createButton = () => screen.getByTestId("create-button");

/** MUI renders its options into a portal once the trigger is opened. */
const chooseOption = (
  selectName: string | RegExp,
  optionName: string | RegExp,
) => {
  fireEvent.mouseDown(screen.getByRole("combobox", { name: selectName }));
  fireEvent.click(screen.getByRole("option", { name: optionName }));
};

describe("<CreateExpenseForm />", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (gql.useCreateExpenseMutation as any).mockReturnValue([vi.fn(), {}]);
    (gql.useMeIdQuery as any).mockReturnValue({
      data: { me: { id: "user-me" } },
    });
    (gql.useMyGroupsQuery as any).mockReturnValue({
      data: {
        myGroups: [
          {
            id: GROUP_ID,
            name: "Household",
            members: [
              { id: "m1", role: "OWNER", user: { id: "user-me", name: "You" } },
              { id: "m2", role: "MEMBER", user: { id: "user-ana", name: "Ana" } },
            ],
          },
        ],
      },
    });
  });

  it("enables Create once an amount is entered", () => {
    render();
    expect(createButton()).toHaveAttribute("disabled");

    fireEvent.change(amountField(), { target: { value: "42" } });
    expect(createButton()).not.toHaveAttribute("disabled");
  });

  it("keeps Create enabled after changing the subcategory", () => {
    render();
    fireEvent.change(amountField(), { target: { value: "42" } });

    chooseOption(/subcategory/i, "Eating out");

    expect(amountField()).toHaveValue("42");
    expect(createButton()).not.toHaveAttribute("disabled");
  });

  it("keeps Create enabled after changing who paid", () => {
    render();
    fireEvent.change(amountField(), { target: { value: "42" } });

    chooseOption(/paid by/i, "Ana");

    expect(amountField()).toHaveValue("42");
    expect(createButton()).not.toHaveAttribute("disabled");
  });

  /*
   * Reported: the Description label renders behind its own outline.
   *
   * An outlined MUI field keeps its label legible by cutting a gap in the
   * border — a `<legend>` inside the fieldset, holding a hidden span the width
   * of the label. No gap, and the border draws straight through the text.
   *
   * Asserted for both fields at once on purpose: if Amount passes and
   * Description fails they differ for some reason worth finding, and if both
   * fail the notch is broken everywhere and is simply easier to see on the
   * focused field, where the outline is 2px of pine instead of a pale hairline.
   */
  it("cuts a gap in the outline for every filled field's label", () => {
    render();
    fireEvent.change(amountField(), { target: { value: "42" } });
    fireEvent.change(
      within(screen.getByTestId("expense-description-input")).getByRole(
        "textbox",
      ),
      { target: { value: "Sip pub" } },
    );

    for (const testId of [
      "expense-amount-input",
      "expense-description-input",
    ]) {
      const legend = screen
        .getByTestId(testId)
        .querySelector("fieldset > legend");

      expect(legend, `${testId} has no legend at all`).not.toBeNull();
      expect(
        legend?.textContent?.trim(),
        `${testId} renders an empty legend, so nothing reserves space for the label`,
      ).toBeTruthy();
    }
  });

  /*
   * The field and the state have to agree, because the button reads the state
   * and the user reads the field. Uncontrolled, they can disagree — a form
   * that looks filled with Create greyed out, and no way to tell why.
   */
  it("shows nothing in a field the state considers empty", () => {
    render();
    expect(amountField()).toHaveValue("");
    expect(
      within(screen.getByTestId("expense-description-input")).getByRole(
        "textbox",
      ),
    ).toHaveValue("");
  });
});
