import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ActionsBar } from "./actions-bar";

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
    const mockPrev = jest.fn();
    const mockNext = jest.fn();

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
    const mockPrev = jest.fn();
    const mockNext = jest.fn();

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

  it("renders and toggles the switch correctly if toggleRollover is provided", () => {
    const mockToggleRollover = jest.fn();
    render(
      <ActionsBar toggleRollover={mockToggleRollover} showRollover={false} />
    );

    const switchElement = screen.getByRole("checkbox");
    fireEvent.click(switchElement);

    expect(mockToggleRollover).toHaveBeenCalledTimes(1);
  });
});
