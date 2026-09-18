/**
 * The whole of demo mode, as far as the rest of the app is concerned.
 *
 * Sitting in front of the http link, this answers operations from the local
 * dataset whenever a demo is running and passes everything else straight
 * through. No container takes an `isDemo` prop, no page has a demo variant and
 * no route is duplicated — which is why the demo can cover the entire app for
 * the cost of one file.
 *
 * Reads the demo cannot fabricate — `Me`, reports, data export — still reach
 * the server, because they are about the real account and answering them with
 * invented figures would be worse than not answering.
 *
 * **Writes do not, with two named exceptions.** Every other mutation during a
 * demo is either applied to the local copy or refused, so no demo action can
 * reach the database however long the mutation list grows. An allow-list is the
 * only safe default: a mutation added next year and forgotten here would
 * otherwise be a real write made during a demo.
 */
import { ApolloLink, Observable, Operation, FetchResult } from "@apollo/client";
import { getDemoState, saveDemoState } from "./demo-store";
import { canResolveQuery, resolveDemoQuery } from "./resolve-demo-query";
import { resolveDemoMutation } from "./resolve-demo-mutation";

/**
 * The only writes allowed out to the network during a demo.
 *
 * These are about the account, not its money, and one of them is how the demo
 * ends — refusing it would leave the tour marked unseen and replaying on every
 * login. Nothing that touches budgets, expenses or households belongs here.
 */
const PASS_THROUGH_MUTATIONS = new Set([
  "MarkOnboardingSeen",
  "ReplayOnboarding",
]);

/** `query` or `mutation`, taken from the document rather than guessed. */
const operationKind = (operation: Operation): string | undefined => {
  const definition = operation.query.definitions.find(
    (d) => d.kind === "OperationDefinition",
  );
  return definition && "operation" in definition ? definition.operation : undefined;
};

const respond = (data: object): Observable<FetchResult> =>
  new Observable((observer) => {
    observer.next({ data });
    observer.complete();
  });

const fail = (error: unknown): Observable<FetchResult> =>
  new Observable((observer) => {
    observer.error(error);
  });

export const demoLink = new ApolloLink((operation, forward) => {
  const state = getDemoState();
  if (!state) return forward(operation);

  const name = operation.operationName;
  const kind = operationKind(operation);

  try {
    if (kind === "query" && canResolveQuery(name)) {
      return respond(resolveDemoQuery(name, state, operation.variables));
    }

    if (kind === "mutation" && !PASS_THROUGH_MUTATIONS.has(name)) {
      const applied = resolveDemoMutation(name, state, operation.variables);
      // Persisted before responding, so a refetch triggered by the mutation's
      // own completion reads the state the write produced rather than the one
      // before it.
      saveDemoState(applied.state);
      return respond(applied.data);
    }
  } catch (error) {
    return fail(error);
  }

  return forward(operation);
});
