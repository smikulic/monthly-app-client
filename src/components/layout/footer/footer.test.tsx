import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

describe("<Footer />", () => {
  it("renders the Footer component correctly", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders the feedback link with the correct href", () => {
    render(<Footer />);
    const link = screen.getByText(/Leave a feedback or suggestion/i);
    expect(link).toHaveAttribute("href", "https://forms.gle/a59QBuddeMJf2S64A");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });
});
