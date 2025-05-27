import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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
import * as gql from "../../generated/graphql";
import { SubcategoryFormFactory } from "./subcategory-form-factory";
import { Category, Subcategory } from "../../generated/graphql";

// Freeze date to a known ISO
const FROZEN_ISO = "2023-01-01T00:00:00.000Z";
const FROZEN_TS = new Date(FROZEN_ISO).getTime();

// Mock GraphQL hooks
vi.mock("../../generated/graphql", () => ({
  useCreateSubcategoryMutation: vi.fn(),
  useUpdateSubcategoryMutation: vi.fn(),
}));

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
    vi.setSystemTime(FROZEN_TS);
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

    const createBtn = screen.getByRole("button", { name: /Create/i });
    expect(createBtn).toBeDisabled();

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
        rolloverDate: FROZEN_ISO,
      },
    });
  });

  it("renders update mode and calls update mutation with initial category", () => {
    const existing: Subcategory = {
      id: "1",
      createdAt: String(FROZEN_TS),
      name: "Existing Subcategory",
      budgetAmount: 1000,
      rolloverDate: String(FROZEN_TS),
      categoryId: "test-category-id",
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

    const saveBtn = screen.getByRole("button", { name: /Save/i });
    expect(saveBtn).toBeEnabled();

    // Change Name and Budget
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "Updated Subcategory" },
    });
    fireEvent.change(screen.getByLabelText(/Budget/i), {
      target: { value: "750" },
    });

    // Click Save
    fireEvent.click(saveBtn);

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({
      variables: {
        id: "1",
        categoryId: "test-category-id",
        name: "Updated Subcategory",
        budgetAmount: 750,
        rolloverDate: FROZEN_ISO,
      },
    });
  });
});
