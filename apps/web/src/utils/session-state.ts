/**
 * Whether a failed `me` means the session is over, or just that the server had
 * a moment.
 *
 * The distinction matters in both directions. Miss a real auth failure and the
 * app renders authenticated pages with no user, which is a `TypeError` and a
 * white screen rather than a degraded view. Treat a transient failure as an
 * auth failure and you sign someone out over a dropped connection, which they
 * cannot undo without their password.
 *
 * The case that was missed: an expired or rejected token makes the server throw
 * `Unauthenticated!`, and Apollo Server returns that as **HTTP 200 with a
 * `graphQLErrors` array**. A check that only looked at `networkError` never saw
 * it — and with 90-day tokens, that was every user eventually.
 */
/**
 * Structural rather than `ApolloError`, so the rule can be tested without
 * constructing one — and so it keeps working if the client's error shape moves
 * underneath it.
 */
interface MaybeApolloError {
  networkError?: { result?: unknown } | null | unknown;
  graphQLErrors?: readonly { readonly message: string }[];
}

const AUTH_MESSAGE = /unauthenticated|invalid token|confirm your email/i;

export const isAuthFailure = (error: MaybeApolloError | undefined): boolean => {
  if (!error) return false;

  const network = String(
    (error.networkError as { result?: unknown } | null)?.result ?? "",
  );
  if (AUTH_MESSAGE.test(network)) return true;

  return Boolean(error.graphQLErrors?.some((e) => AUTH_MESSAGE.test(e.message)));
};
