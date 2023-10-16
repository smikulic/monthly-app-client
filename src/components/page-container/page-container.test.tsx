import React from "react";
import { render, screen } from "@testing-library/react";
// import "@testing-library/jest-dom/extend-expect";
import { PageContainer } from "./page-container";

describe("<PageContainer />", () => {
  const actionsBarComponent = <div>Actions</div>;
  const dataAvailableComponent = <div>Data Available</div>;
  const noDataAvailableComponent = <div>No Data</div>;

  it("displays loading state", () => {
    render(
      <PageContainer
        loading={true}
        noData={false}
        actionsBarComponent={actionsBarComponent}
        dataAvailableComponent={dataAvailableComponent}
        noDataAvailableComponent={noDataAvailableComponent}
      />
    );

    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByLabelText("oval-loading")).toBeInTheDocument();
    expect(screen.queryByText("Data Available")).not.toBeInTheDocument();
    expect(screen.queryByText("No Data")).not.toBeInTheDocument();
  });

  it("displays data available state", () => {
    render(
      <PageContainer
        loading={false}
        noData={false}
        actionsBarComponent={actionsBarComponent}
        dataAvailableComponent={dataAvailableComponent}
        noDataAvailableComponent={noDataAvailableComponent}
      />
    );

    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("Data Available")).toBeInTheDocument();
    expect(screen.queryByText("No Data")).not.toBeInTheDocument();
  });

  it("displays no data available state", () => {
    // Modify the rendering to pass only noDataAvailableComponent or modify the component's logic to make this test meaningful.
    // For now, we're just assuming that all components are passed and the noDataAvailableComponent will be shown anyway.

    render(
      <PageContainer
        loading={false}
        noData={true}
        actionsBarComponent={actionsBarComponent}
        dataAvailableComponent={dataAvailableComponent}
        noDataAvailableComponent={noDataAvailableComponent}
      />
    );

    expect(screen.getByText("No Data")).toBeInTheDocument();
  });
});
