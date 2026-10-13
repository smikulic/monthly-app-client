import { describe, it, expect } from "vitest";
import { isAuthFailure } from "./session-state";

/**
 * The crash this guards against: an expired token makes the server throw
 * `Unauthenticated!`, which Apollo Server returns as **HTTP 200 with a
 * graphQLErrors array**. The old check only looked at `networkError`, so it
 * never fired, `me` stayed undefined, and `/groups` and `/settings` died on
 * `userData.id` and `userData.currency`.
 *
 * Tokens last 90 days, so this was every user eventually.
 */
describe("isAuthFailure", () => {
  it.each([
    ["Unauthenticated!", true],
    ["Please confirm your email before continuing", true],
    ["Context creation failed: invalid token", true],
    ["Failed to fetch", false],
    ["Variable $date of required type String! was not provided", false],
  ])("graphQL error %j", (message, expected) => {
    expect(isAuthFailure({ graphQLErrors: [{ message }] })).toBe(expected);
  });

  it("still catches the network-level form it always caught", () => {
    expect(
      isAuthFailure({ networkError: { result: "Context: invalid token" } }),
    ).toBe(true);
  });

  it("treats no error as no auth failure, so a blip never logs anyone out", () => {
    expect(isAuthFailure(undefined)).toBe(false);
    expect(isAuthFailure({})).toBe(false);
  });
});
