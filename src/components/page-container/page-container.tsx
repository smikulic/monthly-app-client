import React, { ReactNode } from "react";
import * as Sentry from "@sentry/react";
import { LoadingScreen } from "../../components/loading-screen/loading-screen";

export const PageContainer = ({
  loading,
  noData,
  actionsBarComponent,
  dataAvailableComponent,
  noDataAvailableComponent,
}: {
  loading: boolean;
  noData: boolean;
  actionsBarComponent: ReactNode;
  dataAvailableComponent: ReactNode;
  noDataAvailableComponent: ReactNode;
}) => {
  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      {/* Global state */}
      {actionsBarComponent}

      {/* Loading state */}
      {loading && <LoadingScreen />}

      {/* data not available state */}
      {!loading && noData && noDataAvailableComponent}

      {/* data available state */}
      {!loading && !noData && dataAvailableComponent}
    </Sentry.ErrorBoundary>
  );
};
