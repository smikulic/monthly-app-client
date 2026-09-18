import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cssVariables, tokens } from "./tokens";

// `import.meta.dirname` rather than a URL: jsdom's whatwg-url shadows the
// global URL and rejects import.meta.url as a base. A `?raw` import does not
// work either, because Vitest stubs CSS imports unless `css: true` is set.
const css = readFileSync(join(import.meta.dirname, "tokens.css"), "utf8");

/**
 * `tokens.ts` and `tokens.css` hold the same values for different consumers:
 * MUI and echarts need parseable hex, CSS and any future Tailwind `@theme`
 * need custom properties. The duplication is deliberate, so it needs a guard.
 */

const normalise = (value: string) =>
  value.replace(/\s+/g, " ").trim().toLowerCase();

describe("design tokens", () => {
  it("tokens.css mirrors tokens.ts", () => {
    const declared = Object.fromEntries(
      [...css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)].map(
        ([, name, value]) => [name, normalise(value)],
      ),
    );

    const expected = Object.fromEntries(
      Object.entries(cssVariables).map(([name, value]) => [
        name,
        normalise(value),
      ]),
    );

    expect(declared).toEqual(expected);
  });

  /**
   * Spending is the normal state of a budgeting app. If money out ever stops
   * being ink, every expense row turns red and an ordinary month reads as
   * failure — which is the 30-day churn cliff rendered in colour. Easy to
   * break while tidying the palette, so it is pinned.
   */
  it("renders money out as ink, never red", () => {
    expect(tokens.money.neutral).toBe(tokens.ink.primary);
  });
});
