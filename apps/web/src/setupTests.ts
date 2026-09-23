// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { vi } from "vitest";

const storagePrototype = {
  getItem: function (key: string) {
    return localStorageMock[key] || null;
  },
  setItem: function (key: string, value: string) {
    if (!localStorageMock[key]) {
      this.length++;
    }
    localStorageMock[key] = value.toString();
  },
  removeItem: function (key: string) {
    if (localStorageMock[key]) {
      this.length--;
    }
    delete localStorageMock[key];
  },
  clear: function () {
    Object.keys(localStorageMock).forEach(
      (key) => delete localStorageMock[key],
    );
    this.length = 0;
  },
  length: 0,
};

export const localStorageMock = Object.create(storagePrototype);

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

export const mockReplace = vi.fn();

Object.defineProperty(window, "location", {
  value: {
    replace: mockReplace,
  },
});

/*
 * No analytics SDK in unit tests.
 *
 * `posthog-js` reads `window.location.href` when it loads, and the stub above
 * replaces `location` wholesale with just `replace` — so merely importing a
 * component that imports the analytics facade threw on `undefined.match(...)`.
 *
 * Widening the location stub would fix that one symptom, but the better answer
 * is that a unit test should never reach a third-party analytics vendor at all:
 * it is network, it is a singleton, and nothing here asserts on it. Everything
 * the app calls goes through `utils/analytics`, so this mock is invisible to
 * the tests themselves.
 */
vi.mock("posthog-js", () => ({
  default: {
    init: vi.fn(),
    capture: vi.fn(),
    identify: vi.fn(),
    setPersonProperties: vi.fn(),
    opt_in_capturing: vi.fn(),
    opt_out_capturing: vi.fn(),
    reset: vi.fn(),
  },
}));
