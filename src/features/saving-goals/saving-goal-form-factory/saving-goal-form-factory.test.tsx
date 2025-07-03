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
import * as gql from "@/generated/graphql";
import SavingGoalFormFactory from "./saving-goal-form-factory";

const FROZEN_ISO = "2023-01-01T00:00:00.000Z";
const FROZEN_TS = new Date(FROZEN_ISO).getTime();

vi.mock("@/generated/graphql", () => ({
  useCreateSavingGoalMutation: vi.fn(),
  useUpdateSavingGoalMutation: vi.fn(),
}));

describe("<SavingGoalFormFactory />", () => {
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

    (gql.useCreateSavingGoalMutation as any).mockReturnValue([
      mockCreate,
      { data: null, loading: false, error: undefined },
    ]);
    (gql.useUpdateSavingGoalMutation as any).mockReturnValue([
      mockUpdate,
      { data: null, loading: false, error: undefined },
    ]);
  });

  it("– CREATE mode: disables until required fields are filled, shows info alerts, then calls create()", () => {
    render(<SavingGoalFormFactory open={true} closeForm={closeForm} />);

    const createBtn = screen.getByTestId("create-button");

    // Two info alerts in create mode
    expect(screen.getAllByRole("alert")).toHaveLength(2);

    // Grab the Name field using a loose regex
    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: "My Goal" } });

    // Grab the Goal Amount field
    const amountInput = screen.getByLabelText(
      /How much do you estimate you goal costs\?/i
    );
    fireEvent.change(amountInput, { target: { value: "5000" } });
    expect(createBtn).toBeEnabled();

    // Click Create
    fireEvent.click(createBtn);

    // Assert our create mutation was called with the frozen date
    expect(mockCreate).toHaveBeenCalledTimes(1);
    const [{ variables }] = mockCreate.mock.calls[0];
    expect(variables).toEqual({
      name: "My Goal",
      goalDate: new Date(FROZEN_TS).toString(),
      goalAmount: 5000,
      initialSaveAmount: 0,
    });
  });

  it("– UPDATE mode: hides info alerts, pre-fills fields, and calls update()", () => {
    const existing = {
      id: "42",
      createdAt: String(FROZEN_TS),
      name: "Existing Goal",
      goalAmount: 1000,
      initialSaveAmount: 200,
      goalDate: String(FROZEN_TS),
    };

    render(
      <SavingGoalFormFactory
        open={true}
        closeForm={closeForm}
        formData={existing}
      />
    );

    // No info alerts in update mode
    expect(screen.queryByRole("alert")).toBeNull();

    const saveBtn = screen.getByTestId("create-button");
    expect(saveBtn).toBeEnabled();

    // Update Name
    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: "Updated Goal" } });

    // Update Goal Amount
    const amountInput = screen.getByLabelText(
      /How much do you estimate you goal costs\?/i
    );
    fireEvent.change(amountInput, { target: { value: "1500" } });

    // Click Save
    fireEvent.click(saveBtn);

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    const [{ variables }] = mockUpdate.mock.calls[0];
    expect(variables).toEqual({
      id: "42",
      name: "Updated Goal",
      goalDate: new Date(FROZEN_TS).toString(),
      goalAmount: 1500,
      initialSaveAmount: 200,
    });
  });
});
