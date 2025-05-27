import { render, screen, fireEvent } from "@testing-library/react";
import { FormDialog } from "./form-dialog";
import { describe, expect, it, vi } from "vitest";

describe("<FormDialog />", () => {
  it("renders the dialog when open is true", () => {
    render(
      <FormDialog
        open={true}
        title="Test Title"
        disabled={false}
        formActionText="Save"
        formAction={vi.fn()}
        closeForm={vi.fn()}
      >
        test child
      </FormDialog>
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders the form action button with correct text", () => {
    render(
      <FormDialog
        open={true}
        title="Test Title"
        disabled={false}
        formActionText="Save"
        formAction={vi.fn()}
        closeForm={vi.fn()}
      >
        test child
      </FormDialog>
    );
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("calls closeForm when the close button is clicked", () => {
    const closeForm = vi.fn();
    render(
      <FormDialog
        open={true}
        title="Test Title"
        disabled={false}
        formActionText="Save"
        formAction={vi.fn()}
        closeForm={closeForm}
      >
        test child
      </FormDialog>
    );

    fireEvent.click(screen.getByLabelText("close"));
    expect(closeForm).toHaveBeenCalled();
  });

  it("calls formAction when the form action button is clicked", () => {
    const formAction = vi.fn();
    render(
      <FormDialog
        open={true}
        title="Test Title"
        disabled={false}
        formActionText="Save"
        formAction={formAction}
        closeForm={vi.fn()}
      >
        test child
      </FormDialog>
    );

    fireEvent.click(screen.getByText("Save"));
    expect(formAction).toHaveBeenCalled();
  });
});
