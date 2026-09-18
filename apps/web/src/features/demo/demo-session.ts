/**
 * Starting and ending a demo.
 *
 * Both directions have to reset the Apollo cache. Every figure in the app
 * changes at that boundary, and a cache that carried a cached `CategoriesList`
 * across it would show demo budgets in a real account, or the reverse — the one
 * failure mode of this design that would actually alarm someone.
 *
 * The client is handed in from `index.tsx` rather than imported, because the
 * link this module cooperates with is part of that client's construction.
 */
import { ApolloClient, useApolloClient } from "@apollo/client";
import { useCallback, useSyncExternalStore } from "react";
import { GET_DEMO_DATASET } from "./demo-queries";
import { StoredDemoDataset } from "./demo-dataset";
import {
  exitDemo,
  isDemoActive,
  startDemo,
  subscribeToDemo,
} from "./demo-store";

let client: ApolloClient<unknown> | null = null;

export const setDemoClient = (apolloClient: ApolloClient<unknown>) => {
  client = apolloClient;
};

/**
 * `resetStore` refetches every active query, and a single failure rejects the
 * whole call. The cache has already been cleared by then, so swallowing it
 * leaves the app in a correct state that simply has not finished loading.
 */
const resetQuietly = async (apolloClient: ApolloClient<unknown>) => {
  try {
    await apolloClient.resetStore();
  } catch {
    /* the refetches will settle on their own */
  }
};

/** Fetches the dataset, caches it locally and switches the app into demo mode. */
export const enterDemo = async (apolloClient?: ApolloClient<unknown>) => {
  const active = apolloClient ?? client;
  if (!active) throw new Error("Apollo client not registered");

  const { data } = await active.query({
    query: GET_DEMO_DATASET,
    // Always the current dataset: a cached copy would defeat the point of
    // being able to rewrite the demo without a client release.
    fetchPolicy: "network-only",
  });

  const payload = JSON.parse(data.demoDataset.payload) as StoredDemoDataset;
  startDemo(payload, data.demoDataset.version);
  await resetQuietly(active);
};

export const leaveDemo = async (apolloClient?: ApolloClient<unknown>) => {
  const active = apolloClient ?? client;
  exitDemo();
  if (active) await resetQuietly(active);
};

/** True while a demo is running. Re-renders when it starts or ends. */
export const useIsDemo = () =>
  useSyncExternalStore(
    subscribeToDemo,
    isDemoActive,
    // No demo during server rendering; there is no localStorage to read.
    () => false,
  );

export const useDemoControls = () => {
  const apolloClient = useApolloClient();

  return {
    enter: useCallback(() => enterDemo(apolloClient), [apolloClient]),
    leave: useCallback(() => leaveDemo(apolloClient), [apolloClient]),
  };
};
