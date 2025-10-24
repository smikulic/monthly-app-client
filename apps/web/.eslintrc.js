module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: "detect" },
  },
  env: {
    browser: true,
    es2021: true,
    "vitest/globals": true,
  },
  plugins: [
    "react",
    "react-hooks",
    "@typescript-eslint",
    "jsx-a11y",
    "vitest",
    "testing-library",
  ],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:vitest/recommended",
    "plugin:testing-library/react",
  ],
  rules: {
    // your overrides…
    "react/react-in-jsx-scope": "off", // not needed in React 17+
    "@typescript-eslint/explicit-function-return-type": "off",
    // …
  },
};
