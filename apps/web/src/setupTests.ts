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
      (key) => delete localStorageMock[key]
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
