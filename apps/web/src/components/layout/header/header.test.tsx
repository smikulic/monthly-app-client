import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";
import { Header } from "./header";

/**
 * The feedback link used to live in a fixed footer with its own test. The
 * footer held nothing else, so it was removed and the link moved into the
 * account menu — these assertions came with it.
 */
describe("<Header />", () => {
  const open = () => {
    render(<Header onLogout={() => {}} />);
    fireEvent.click(screen.getByTestId("account-menu-trigger"));
  };

  it("exposes the feedback link from the account menu", () => {
    open();
    expect(screen.getByTestId("feedback-link")).toBeInTheDocument();
  });

  it("opens the feedback form in a new tab", () => {
    open();
    const link = screen.getByTestId("feedback-link");
    expect(link).toHaveAttribute("href", "https://forms.gle/a59QBuddeMJf2S64A");
    expect(link).toHaveAttribute("target", "_blank");
    // Without noreferrer the new tab can reach back through window.opener.
    expect(link).toHaveAttribute("rel", "noreferrer");
  });
});
