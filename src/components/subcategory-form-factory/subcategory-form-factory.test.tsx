import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import { SubcategoryFormFactory } from "./subcategory-form-factory";
import {
  CREATE_SUBCATEGORY_MUTATION,
  UPDATE_SUBCATEGORY_MUTATION,
} from "../categories-list/categories-list-queries";
import { Category, Subcategory } from "../../generated/graphql";

const categoryId = "test-category-id";

// Mock mutations and any other external calls
const createSubcategoryMock = {
  request: {
    query: CREATE_SUBCATEGORY_MUTATION,
    variables: {
      name: "New Subcategory",
      budgetAmount: 500,
      categoryId: categoryId,
    },
  },
  result: {
    data: {
      createSubcategory: {
        id: "new-subcategory-id", // The id returned by the server
        name: "New Subcategory",
        categoryId: categoryId,
        __typename: "Subcategory", // Apollo Client expects the __typename field on all objects
      },
    },
  },
};

const updateSubcategoryMock = {
  request: {
    query: UPDATE_SUBCATEGORY_MUTATION,
    variables: {
      id: "1",
      name: "Updated Subcategory",
      budgetAmount: 500,
      categoryId: categoryId,
    },
  },
  result: {
    data: {
      updateSubcategory: {
        id: "1",
        name: "Updated Subcategory",
        budgetAmount: 500,
        categoryId: categoryId,
        __typename: "Subcategory",
      },
    },
  },
};

const mocks = [createSubcategoryMock, updateSubcategoryMock];

const categories: Category[] = [
  { id: categoryId, name: "Test Category 1" },
  { id: "test-category-id2", name: "Test Category 2" },
];
const subcategoryData: Subcategory = {
  id: "1",
  name: "Test Subcategory",
  categoryId: categoryId,
  createdAt: "1672531200000",
  rolloverDate: "1672531200000",
};

describe("SubcategoryFormFactory", () => {
  it("renders create form when no formData is passed", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SubcategoryFormFactory
          open={true}
          closeForm={jest.fn()}
          presetCategoryId={categoryId}
          categories={categories}
        />
      </MockedProvider>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rollover date/i)).toBeInTheDocument();
  });

  it("renders update form when formData is passed", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SubcategoryFormFactory
          open={true}
          closeForm={jest.fn()}
          formData={subcategoryData}
          presetCategoryId={categoryId}
          categories={categories}
        />
      </MockedProvider>
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue(subcategoryData.name);
  });

  it("submits the form and calls createSubcategory mutation when in create mode", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SubcategoryFormFactory
          open={true}
          closeForm={jest.fn()}
          presetCategoryId={categoryId}
          categories={categories}
        />
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "New Subcategory" },
    });
    fireEvent.change(screen.getByLabelText(/budget/i), {
      target: { value: "500" },
    });
    fireEvent.click(screen.getByText(/create/i));

    await waitFor(() => {
      expect(createSubcategoryMock.request.variables.name).toBe(
        "New Subcategory"
      );
    });
  });

  it("calls the updateSubcategory mutation when submitting the update form", async () => {
    render(
      <MockedProvider mocks={[updateSubcategoryMock]} addTypename={false}>
        <SubcategoryFormFactory
          open={true}
          closeForm={jest.fn()}
          formData={subcategoryData}
          presetCategoryId={categoryId}
          categories={categories}
        />
      </MockedProvider>
    );

    // Find the input, change its value, and simulate form submission
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Updated Subcategory" },
    });
    fireEvent.change(screen.getByLabelText(/budget/i), {
      target: { value: "500" },
    });
    // Open the dropdown
    fireEvent.mouseDown(screen.getByRole("button", { name: /category/i }));
    // Click on a menu item
    fireEvent.click(screen.getByText(categories[1].name));
    fireEvent.click(screen.getByText(/save/i));

    // Wait for the update mutation to be called
    await waitFor(() => {
      // Check if the mutation was called with the correct variables
      expect(updateSubcategoryMock.request.variables.name).toBe(
        "Updated Subcategory"
      );
    });
  });
});
