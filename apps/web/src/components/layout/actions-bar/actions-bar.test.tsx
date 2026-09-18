import { render, screen, fireEvent } from "@/test-utils";
import { ActionsBar } from "./actions-bar";
import { describe, expect, it, vi } from "vitest";

describe("<ActionsBar />", () => {
  it("renders children if provided", () => {
    render(
      <ActionsBar>
        <div>Test Children</div>
      </ActionsBar>
    );
    expect(screen.getByText("Test Children")).toBeInTheDocument();
  });

  it("renders the formatted date and pagination icons if pageDate, onClickPrevious and onClickNext are provided", () => {
    const mockDate = new Date(2023, 6, 15);
    const mockPrev = vi.fn();
    const mockNext = vi.fn();

    render(
      <ActionsBar
        pageDate={mockDate}
        onClickPrevious={mockPrev}
        onClickNext={mockNext}
      />
    );
    expect(screen.getByText("Jul 2023")).toBeInTheDocument();
    expect(screen.getByTestId("ChevronLeftIcon")).toBeInTheDocument();
    expect(screen.getByTestId("ChevronRightIcon")).toBeInTheDocument();
  });

  it("triggers onClickPrevious and onClickNext when icons are clicked", () => {
    const mockPrev = vi.fn();
    const mockNext = vi.fn();

    render(
      <ActionsBar
        pageDate={new Date()}
        onClickPrevious={mockPrev}
        onClickNext={mockNext}
      />
    );
    fireEvent.click(screen.getByTestId("ChevronLeftIcon"));
    fireEvent.click(screen.getByTestId("ChevronRightIcon"));

    expect(mockPrev).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it("toggles rollover when the chip is clicked", () => {
    const mockToggleRollover = vi.fn();
    render(
      <ActionsBar toggleRollover={mockToggleRollover} showRollover={false} />
    );

    fireEvent.click(screen.getByTestId("rollover-toggle"));

    expect(mockToggleRollover).toHaveBeenCalledTimes(1);
  });

  // The chip replaced a Switch, so pressed state is carried by aria-pressed
  // rather than a checkbox's checked state.
  it("reports rollover state through aria-pressed", () => {
    const { unmount } = render(
      <ActionsBar toggleRollover={vi.fn()} showRollover={false} />
    );
    expect(screen.getByTestId("rollover-toggle")).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    unmount();

    render(<ActionsBar toggleRollover={vi.fn()} showRollover />);
    expect(screen.getByTestId("rollover-toggle")).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
