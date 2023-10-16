import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormDialog } from "./form-dialog";

describe("<FormDialog />", () => {
  it("renders the dialog when open is true", () => {
    render(
      <FormDialog
        open={true}
        title="Test Title"
        disabled={false}
        formActionText="Save"
        formAction={jest.fn()}
        closeForm={jest.fn()}
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
        formAction={jest.fn()}
        closeForm={jest.fn()}
      >
        test child
      </FormDialog>
    );
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("calls closeForm when the close button is clicked", () => {
    const closeForm = jest.fn();
    render(
      <FormDialog
        open={true}
        title="Test Title"
        disabled={false}
        formActionText="Save"
        formAction={jest.fn()}
        closeForm={closeForm}
      >
        test child
      </FormDialog>
    );

    fireEvent.click(screen.getByLabelText("close"));
    expect(closeForm).toHaveBeenCalled();
  });

  it("calls formAction when the form action button is clicked", () => {
    const formAction = jest.fn();
    render(
      <FormDialog
        open={true}
        title="Test Title"
        disabled={false}
        formActionText="Save"
        formAction={formAction}
        closeForm={jest.fn()}
      >
        test child
      </FormDialog>
    );

    fireEvent.click(screen.getByText("Save"));
    expect(formAction).toHaveBeenCalled();
  });
});
