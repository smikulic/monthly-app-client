import { test, expect } from "@playwright/test";

test.describe("Navigation Test", () => {
  test("login and check all main navigation links work", async ({ page }) => {
    // Step 1: Navigate to home and login
    await page.goto("/");

    await page.getByPlaceholder("Enter your email").fill("demo@example.com");
    await page.getByPlaceholder("Enter your password").fill("password123");
    await page.getByRole("button", { name: "Login" }).click();

    // Wait for login to complete
    await page.waitForLoadState("networkidle");
    // await page.waitForTimeout(5000);

    // Step 2: Test Expenses page
    await page.getByRole("link", { name: "Expenses" }).click();
    // await page.goto("/expenses");
    await page.waitForLoadState("networkidle");
    await expect(page.url()).toContain("/expenses");
    await page.getByTestId("back-button").click();
    console.log("Expenses page loaded successfully");

    // Step 3: Test Budget page
    await page.getByRole("link", { name: "Budget" }).click();
    // await page.goto("/budget");
    await page.waitForLoadState("networkidle");
    await expect(page.url()).toContain("/budget");
    await page.getByTestId("back-button").click();
    console.log("Budget page loaded successfully");

    // Step 4: Test Saving Goals page
    // await page.goto("/saving-goals");
    await page.getByRole("link", { name: "Saving Goals" }).click();
    await page.waitForLoadState("networkidle");
    await expect(page.url()).toContain("/saving-goals");
    await page.getByTestId("back-button").click();
    console.log("Saving Goals page loaded successfully");

    // Step 5: Test Investments page
    // await page.goto("/investments");
    await page.getByRole("link", { name: "Investments" }).click();
    await page.waitForLoadState("networkidle");
    await expect(page.url()).toContain("/investments");
    await page.getByTestId("back-button").click();
    console.log("Investments page loaded successfully");

    // Step 6: Go back to home page
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.url()).toBe("http://localhost:3000/");
    console.log("Home page loaded successfully");

    console.log("All navigation tests passed!");
  });
});
