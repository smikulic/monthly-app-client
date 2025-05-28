import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./progress-bar";
import { describe, expect, it } from "vitest";

describe("<ProgressBar />", () => {
  it("renders the progress bar with correct width", () => {
    const value = 50;
    const maxValue = 100;
    render(<ProgressBar value={value} maxValue={maxValue} />);

    // Verifying the width of ProgressBarInnerStyled based on value and maxValue
    const progressBarInner = screen.getByTestId("progress-bar-inner");
    expect(progressBarInner).toHaveStyle("width: 50%");
  });

  it("adjusts width with different values", () => {
    const value = 25;
    const maxValue = 100;
    render(<ProgressBar value={value} maxValue={maxValue} />);

    const progressBarInner = screen.getByTestId("progress-bar-inner");
    expect(progressBarInner).toHaveStyle("width: 25%");
  });
});
