import {
  render as rtlRender,
  screen,
  fireEvent,
} from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import * as gql from "@/generated/graphql";
import { SubcategoryFormFactory } from "./subcategory-form-factory";
import { Category, Subcategory } from "@/generated/graphql";

// Freeze date to a known ISO
const FROZEN_ISO = "1970-01-01";

// Mock GraphQL hooks
vi.mock("@/generated/graphql", () => ({
  useCreateSubcategoryMutation: vi.fn(),
  useUpdateSubcategoryMutation: vi.fn(),
  // Update mode renders the budget schedule, which reaches for these.
  useSetSubcategoryBudgetMutation: vi.fn(),
  useDeleteSubcategoryBudgetMutation: vi.fn(),
}));

// The schedule editor reaches for the client to drop cached month figures, so
// the tree needs a provider even though every mutation here is mocked.
const render = (ui: React.ReactElement) =>
  rtlRender(<MockedProvider addTypename={false}>{ui}</MockedProvider>);

describe("<SubcategoryFormFactory />", () => {
  const presetCategoryId = "test-category-id";
  const categories: Category[] = [
    { id: "test-category-id", name: "Cat One" },
    { id: "test-category-id2", name: "Cat Two" },
  ];
  const closeForm = vi.fn();
  let mockCreate: ReturnType<typeof vi.fn>;
  let mockUpdate: ReturnType<typeof vi.fn>;

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FROZEN_ISO);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.clearAllMocks();

    mockCreate = vi.fn();
    mockUpdate = vi.fn();

    (gql.useCreateSubcategoryMutation as any).mockReturnValue([
      mockCreate,
      { data: null, loading: false, error: undefined },
    ]);
    (gql.useUpdateSubcategoryMutation as any).mockReturnValue([
      mockUpdate,
      { data: null, loading: false, error: undefined },
    ]);
    (gql.useSetSubcategoryBudgetMutation as any).mockReturnValue([
      vi.fn(),
      { loading: false },
    ]);
    (gql.useDeleteSubcategoryBudgetMutation as any).mockReturnValue([
      vi.fn(),
      { loading: false },
    ]);
  });

  it("disables Create until name and budget are filled, then calls create mutation", () => {
    render(
      <SubcategoryFormFactory
        open={true}
        closeForm={closeForm}
        presetCategoryId={presetCategoryId}
        categories={categories}
      />
    );

    const createBtn = screen.getByTestId("create-button");

    // Fill Name and Budget
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "New Subcategory" },
    });
    fireEvent.change(screen.getByLabelText(/Budget/i), {
      target: { value: "500" },
    });
    expect(createBtn).toBeEnabled();

    // Click Create
    fireEvent.click(createBtn);

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith({
      variables: {
        categoryId: presetCategoryId,
        name: "New Subcategory",
        budgetAmount: 500,
        // The opening period's month, named to match the schedule.
        validFrom: FROZEN_ISO,
      },
    });
  });

  it("renders update mode and calls update mutation with initial category", () => {
    const existing: Subcategory = {
      id: "1",
      createdAt: FROZEN_ISO,
      name: "Existing Subcategory",
      budgetAmount: 1000,
      rolloverDate: FROZEN_ISO,
      categoryId: "test-category-id",
      budgetForMonth: 1000,
      rolloverRemaining: 1000,
      budgets: [],
      __typename: "Subcategory",
    };

    render(
      <SubcategoryFormFactory
        open={true}
        closeForm={closeForm}
        presetCategoryId={presetCategoryId}
        categories={categories}
        formData={existing}
      />
    );

    const saveBtn = screen.getByTestId("create-button");
    expect(saveBtn).toBeEnabled();

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "Updated Subcategory" },
    });

    // Click Save
    fireEvent.click(saveBtn);

    // No amount in the payload: the schedule owns it, and its rows save
    // themselves rather than waiting for this button.
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({
      variables: {
        id: "1",
        categoryId: "test-category-id",
        name: "Updated Subcategory",
      },
    });
  });

  it("shows the budget schedule instead of a single amount when editing", () => {
    const existing: Subcategory = {
      id: "1",
      createdAt: FROZEN_ISO,
      name: "Groceries",
      budgetAmount: 700,
      rolloverDate: FROZEN_ISO,
      categoryId: "test-category-id",
      budgetForMonth: 700,
      rolloverRemaining: 700,
      budgets: [
        {
          id: "period-1",
          amount: 100,
          validFrom: String(Date.UTC(2023, 5, 1)),
          __typename: "SubcategoryBudget",
        },
        {
          id: "period-2",
          amount: 700,
          validFrom: String(Date.UTC(2026, 0, 1)),
          __typename: "SubcategoryBudget",
        },
      ],
      __typename: "Subcategory",
    };

    render(
      <SubcategoryFormFactory
        open={true}
        closeForm={closeForm}
        presetCategoryId={presetCategoryId}
        categories={categories}
        formData={existing}
      />
    );

    expect(screen.getByText("Budget history")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("700")).toBeInTheDocument();
    expect(screen.getByText(/from Jun 2023/)).toBeInTheDocument();
    expect(screen.getByText(/from Jan 2026/)).toBeInTheDocument();
  });
});
