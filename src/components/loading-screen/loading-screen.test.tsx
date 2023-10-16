import React from "react";
import { render, screen } from "@testing-library/react";
import { LoadingScreen } from "./loading-screen";

describe("<LoadingScreen />", () => {
  it("renders the loading spinner", () => {
    render(<LoadingScreen />);

    // Verifying the spinner by its aria label
    const spinnerElement = screen.getByTestId("loading-screen");
    expect(spinnerElement).toBeInTheDocument();
  });
});
