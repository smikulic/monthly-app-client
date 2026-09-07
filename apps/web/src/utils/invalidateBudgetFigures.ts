import { ApolloClient } from "@apollo/client";

/**
 * Drops every cached month of the categories list.
 *
 * `budgetForMonth` and `rolloverRemaining` are computed per month, so the cache
 * holds a separate entry for each month visited. Almost any write moves several
 * of them at once: rollover is cumulative, so an expense recorded in March
 * changes April onwards too, and opening a budget period changes every month
 * from that point.
 *
 * Refetching only the active query leaves the others stale until a reload.
 * Working out exactly which months moved would mean re-implementing the accrual
 * on the client, which is the thing we just removed, so the whole field goes and
 * each month refetches when it is next looked at.
 */
export const invalidateBudgetFigures = (client: ApolloClient<object>) => {
  client.cache.evict({ id: "ROOT_QUERY", fieldName: "categories" });
  client.cache.gc();
};
