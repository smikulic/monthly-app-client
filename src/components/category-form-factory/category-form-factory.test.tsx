import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import { toast } from "react-toastify";
import { CategoryFormFactory } from "./category-form-factory";
import {
  CREATE_CATEGORY_MUTATION,
  UPDATE_CATEGORY_MUTATION,
} from "../categories-list/categories-list-queries";

// Mock mutations and any other external calls
const createCategoryMock = {
  request: {
    query: CREATE_CATEGORY_MUTATION,
    variables: {
      name: "New Category",
    },
  },
  result: {
    data: {
      createCategory: {
        id: "new-category-id", // The id returned by the server
        name: "New Category",
        __typename: "Category", // Apollo Client expects the __typename field on all objects
      },
    },
  },
};

const updateCategoryMock = {
  request: {
    query: UPDATE_CATEGORY_MUTATION,
    variables: {
      id: "1",
      name: "Updated Category",
    },
  },
  result: {
    data: {
      updateCategory: {
        id: "1",
        name: "Updated Category",
        __typename: "Category",
      },
    },
  },
};

const mocks = [createCategoryMock, updateCategoryMock];

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
}));

const categoryData = {
  id: "1",
  name: "Test Category",
};

describe("CategoryFormFactory", () => {
  it("renders create form when no formData is passed", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CategoryFormFactory open={true} closeForm={jest.fn()} />
      </MockedProvider>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/tip:/i)).toBeInTheDocument();
  });

  it("renders update form when formData is passed", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CategoryFormFactory
          open={true}
          closeForm={jest.fn()}
          formData={categoryData}
        />
      </MockedProvider>
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue(categoryData.name);
    expect(screen.queryByText(/tip:/i)).not.toBeInTheDocument();
  });

  it("submits the form and calls createCategory mutation when in create mode", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CategoryFormFactory open={true} closeForm={jest.fn()} />
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "New Category" },
    });
    fireEvent.click(screen.getByText(/create/i));

    await waitFor(() => {
      expect(createCategoryMock.request.variables.name).toBe("New Category");
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining("successfully created")
      );
    });
  });

  it("calls the updateCategory mutation when submitting the update form", async () => {
    render(
      <MockedProvider mocks={[updateCategoryMock]} addTypename={false}>
        <CategoryFormFactory
          open={true}
          closeForm={jest.fn()}
          formData={categoryData}
        />
      </MockedProvider>
    );

    // Find the input, change its value, and simulate form submission
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: "Updated Category" } });
    fireEvent.click(screen.getByText(/save/i));

    // Wait for the update mutation to be called
    await waitFor(() => {
      // Check if the mutation was called with the correct variables
      expect(updateCategoryMock.request.variables.name).toBe(
        "Updated Category"
      );
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining("successfully updated")
      );
    });
  });
});
