import { test, expect, Page } from "@playwright/test";
import { tourSteps } from "../../src/features/demo/tour/tour-steps";

/**
 * The tour's only real failure mode is silence.
 *
 * driver.js skips a step whose anchor never appears, so a renamed or deleted
 * `data-tour` attribute does not throw, does not log and does not look broken —
 * the tour simply gets shorter, and nobody notices until it has lost half of
 * itself. Unit tests cannot catch it either: the anchors live in components
 * spread across four routes and only exist once their queries have resolved.
 *
 * So this walks the whole thing the way a person would, and asserts every step
 * actually appeared.
 */

const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "password123";

const login = async (page: Page) => {
  await page.goto("/");
  await page.getByPlaceholder("Enter your email").fill(DEMO_EMAIL);
  await page.getByPlaceholder("Enter your password").fill(DEMO_PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByTestId("account-menu-trigger")).toBeVisible();
};

const startTourFromSettings = async (page: Page) => {
  await page.goto("/settings");
  await page.getByRole("button", { name: "Take the tour" }).click();
};

// Steps are filtered the same way the runner filters them, so the desktop and
// mobile projects each assert their own list rather than a shared guess.
const expectedSteps = (isMobile: boolean) =>
  tourSteps.filter((step) => !(isMobile && step.desktopOnly));

test.describe("First-run tour", () => {
  test("walks every step over the demo household", async ({
    page,
    isMobile,
  }) => {
    await login(page);
    await startTourFromSettings(page);

    const steps = expectedSteps(Boolean(isMobile));

    for (const [index, step] of steps.entries()) {
      const popover = page.locator(".driver-popover.monthly-tour");

      await expect(
        popover.getByText(step.title, { exact: true }),
        `step ${index + 1} ("${step.title}") never appeared — its anchor "${step.anchor ?? "none"}" is probably gone`,
      ).toBeVisible({ timeout: 15000 });

      // Spotlighted steps must have something spotlighted. A step that fell
      // back to a centred popover has lost its anchor even though it rendered.
      if (step.anchor) {
        await expect(
          page.locator(`[data-tour="${step.anchor}"]`),
          `anchor "${step.anchor}" is missing from the page`,
        ).toBeVisible();
      }

      const isLast = index === steps.length - 1;
      await popover
        .getByRole("button", { name: isLast ? "Set up my budget" : "Next" })
        .click();
    }
  });

  /*
   * That demo writes never reach the server is asserted against the link
   * itself in `demo-link.test.ts`, which can enumerate mutations properly.
   * What only a browser can check is that walking the real tour — which
   * expands rows and drives the router — does not send one by accident.
   */
  test("sends no write while showing someone else's money", async ({
    page,
    isMobile,
  }) => {
    await login(page);

    const writes: string[] = [];
    await page.route("**/*", async (route) => {
      const request = route.request();
      if (request.method() === "POST") {
        const body = request.postDataJSON?.();
        if (body?.query?.trimStart().startsWith("mutation")) {
          writes.push(body.operationName ?? "anonymous");
        }
      }
      await route.continue();
    });

    await startTourFromSettings(page);
    const popover = page.locator(".driver-popover.monthly-tour");

    for (const step of expectedSteps(Boolean(isMobile))) {
      await expect(popover.getByText(step.title, { exact: true })).toBeVisible({
        timeout: 15000,
      });
      await popover.getByRole("button").filter({ hasText: /Next|Set up/ }).click();
    }

    // Marking the tour seen is the one write the demo is allowed to make.
    expect(
      writes.filter((name) => name !== "MarkOnboardingSeen"),
      "a demo action reached the server",
    ).toEqual([]);
  });

  test("clears itself on exit", async ({ page }) => {
    await login(page);
    await startTourFromSettings(page);

    await expect(page.getByText("Sample household.")).toBeVisible();
    await page.getByRole("button", { name: "Exit demo" }).click();

    await expect(page.getByText("Sample household.")).toBeHidden();
    expect(
      await page.evaluate(() => localStorage.getItem("monthly.demo")),
    ).toBeNull();
  });
});
