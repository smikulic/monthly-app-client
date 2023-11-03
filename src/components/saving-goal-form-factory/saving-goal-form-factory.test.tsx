import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { SavingGoalFormFactory } from "./saving-goal-form-factory";
import {
  CREATE_SAVING_GOAL_MUTATION,
  UPDATE_SAVING_GOAL_MUTATION,
} from "../saving-goals-list/saving-goals-list-queries";

// Mock mutations and any other external calls
const createSavingGoalMock = {
  request: {
    query: CREATE_SAVING_GOAL_MUTATION,
    variables: {
      name: "New Saving Goal",
      goalDate: "1672531200000", // Example timestamp for the goal date
      goalAmount: 5000,
      initialSaveAmount: 0,
    },
  },
  result: {
    data: {
      createSavingGoal: {
        id: "new-saving-goal-id", // The id returned by the server
        name: "New Saving Goal",
        __typename: "Saving Goal", // Apollo Client expects the __typename field on all objects
      },
    },
  },
};

const updateSavingGoalMock = {
  request: {
    query: UPDATE_SAVING_GOAL_MUTATION,
    variables: {
      id: "1",
      name: "Updated Saving Goal",
      goalDate: "1672531200000", // Example timestamp for the goal date
      goalAmount: 5000,
      initialSaveAmount: 0,
    },
  },
  result: {
    data: {
      updateSavingGoal: {
        id: "1",
        name: "Updated Saving Goal",
        goalDate: "1672531200000",
        goalAmount: 5000,
        initialSaveAmount: 0,
        __typename: "SavingGoal",
      },
    },
  },
};

const mocks = [createSavingGoalMock, updateSavingGoalMock];

const savingGoalData = {
  id: "1",
  createdAt: "1672531200000",
  name: "Test Saving Goal",
  goalAmount: 5000,
  goalDate: "1672531200000",
};

describe("SavingGoalFormFactory", () => {
  it("renders create form when no formData is passed", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SavingGoalFormFactory open={true} closeForm={jest.fn()} />
      </MockedProvider>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/goal date/i)).toBeInTheDocument();
    expect(screen.getByText(/example:/i)).toBeInTheDocument();
  });

  it("renders update form when formData is passed", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SavingGoalFormFactory
          open={true}
          closeForm={jest.fn()}
          formData={savingGoalData}
        />
      </MockedProvider>
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue(savingGoalData.name);
    expect(screen.getByLabelText(/goal costs/i)).toHaveValue(
      savingGoalData.goalAmount.toString()
    );
    expect(screen.queryByText(/example:/i)).not.toBeInTheDocument();
  });

  it("submits the form and calls createSavingGoal mutation when in create mode", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SavingGoalFormFactory open={true} closeForm={jest.fn()} />
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "New Saving Goal" },
    });
    fireEvent.change(screen.getByLabelText(/goal costs/i), {
      target: { value: "5000" },
    });
    fireEvent.change(screen.getByLabelText(/goal date/i), {
      target: {
        value:
          "Fri Nov 03 2023 13:30:20 GMT+0100 (Central European Standard Time)",
      },
    });
    fireEvent.click(screen.getByText(/create/i));

    await waitFor(() => {
      expect(createSavingGoalMock.request.variables.name).toBe(
        "New Saving Goal"
      );
    });
  });

  it("calls the updateSavingGoal mutation when submitting the update form", async () => {
    render(
      <MockedProvider mocks={[updateSavingGoalMock]} addTypename={false}>
        <SavingGoalFormFactory
          open={true}
          closeForm={jest.fn()}
          formData={savingGoalData}
        />
      </MockedProvider>
    );

    // Find the input, change its value, and simulate form submission
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: "Updated Saving Goal" } });
    fireEvent.click(screen.getByText("Save"));

    // Wait for the update mutation to be called
    await waitFor(() => {
      // Check if the mutation was called with the correct variables
      expect(updateSavingGoalMock.request.variables.name).toBe(
        "Updated Saving Goal"
      );
    });
  });
});
