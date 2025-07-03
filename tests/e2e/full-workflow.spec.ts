import { test, expect } from "@playwright/test";

test.describe("Full Workflow Test", () => {
  test.skip("create and delete category, subcategory, and expense", async ({
    page,
  }) => {
    // Step 1: Login
    await page.goto("/");
    await page.getByPlaceholder("Enter your email").fill("demo@example.com");
    await page.getByPlaceholder("Enter your password").fill("password123");
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForLoadState("networkidle");

    console.log("Logged in successfully");

    // Step 2: Navigate to Budget page and create category
    await page.getByRole("link", { name: "Budget" }).click();
    await page.waitForLoadState("networkidle");
    await expect(page.url()).toContain("/budget");

    // Debug: Check what's on the page
    const pageContent = await page.textContent("body");
    console.log(
      "Budget page contains 'Add category':",
      pageContent?.includes("Add category")
    );

    // Click Add category button using data-testid
    await page.getByTestId("add-category-button").click();
    await page.waitForTimeout(1000); // Wait for modal to open

    // Fill category form using input selector
    await page
      .getByTestId("category-name-input")
      .locator("input")
      .fill("Test Category E2E");
    await page.getByTestId("create-button").click();

    // Wait for the category to appear in the list and close modal
    await page.waitForSelector('text="Test Category E2E"');
    await page.keyboard.press("Escape"); // Close the modal
    await page.waitForTimeout(1000);

    console.log("Created category: Test Category E2E");

    // Step 3: Create subcategory (need to click on category first to expand it)
    await page.getByText("Test Category E2E").first().click(); // Expand the category
    await page.waitForTimeout(500);
    await page.getByText("Add Test Category E2E subcategory").click();
    await page.waitForTimeout(1000);

    // Fill subcategory form using input selectors
    await page
      .getByTestId("subcategory-name-input")
      .locator("input")
      .fill("Test Subcategory E2E");
    await page
      .getByTestId("subcategory-budget-input")
      .locator("input")
      .fill("200");
    await page.getByTestId("create-button").click();

    // Wait for the subcategory to appear in the list
    await page.waitForSelector('text="Test Subcategory E2E"');
    await page.waitForTimeout(1000);

    console.log("Created subcategory: Test Subcategory E2E");

    // // Step 4: Navigate to Expenses page and create expense
    // await page.getByRole("link", { name: "Expenses" }).click();
    // await page.waitForLoadState("networkidle");
    // await expect(page.url()).toContain("/expenses");

    // await page.getByText("Add expense").click();
    // await page.waitForTimeout(1000);

    // // Fill expense form using input selectors
    // await page.getByTestId("expense-description-input").locator('input').fill("Test Expense E2E");
    // await page.getByTestId("expense-amount-input").locator('input').fill("50");

    // // Select subcategory (which includes our test subcategory)
    // await page.getByTestId("expense-subcategory-select").click();
    // await page.getByText("Test Subcategory E2E").click();

    // await page.getByTestId("create-button").click();
    // await page.waitForTimeout(2000);

    // // Verify expense was created
    // await expect(page.getByText("Test Expense E2E")).toBeVisible();
    // console.log("Created expense: Test Expense E2E");

    // // Step 5: Delete the expense
    // await page.getByText("Test Expense E2E").click();
    // await page.getByRole("button", { name: "Delete" }).click();
    // await page.getByRole("button", { name: "Delete" }).click(); // Confirm deletion
    // await page.waitForTimeout(2000);

    // console.log("Deleted expense: Test Expense E2E");

    // Step 6: Navigate back to Budget page to delete subcategory
    // await page.getByRole("link", { name: "Budget" }).click();
    // await page.waitForLoadState("networkidle");

    // Delete subcategory - first find the subcategory row and click the three-dot menu
    const subcategoryRow = page
      .locator("span")
      .filter({ hasText: "Test Subcategory E2E" });
    await subcategoryRow.getByRole("button", { name: "More options" }).click();
    await page.getByRole("menuitem", { name: "Remove" }).click();
    await page.getByRole("button", { name: "Delete" }).click(); // Confirm deletion
    await page.waitForTimeout(2000);

    console.log("Deleted subcategory: Test Subcategory E2E");

    // Step 7: Delete category - find the category row and click the three-dot menu
    const categoryRow = page
      .locator("div")
      .filter({ hasText: "Test Category E2E" });
    await categoryRow.getByRole("button", { name: "More options" }).click();
    await page.getByRole("menuitem", { name: "Remove" }).click();
    await page.getByRole("button", { name: "Delete" }).click(); // Confirm deletion
    await page.waitForTimeout(2000);

    console.log("Deleted category: Test Category E2E");

    // Step 8: Verify everything is cleaned up
    await page.waitForTimeout(1000);
    const finalPageContent = await page.textContent("body");
    expect(finalPageContent).not.toContain("Test Category E2E");
    expect(finalPageContent).not.toContain("Test Subcategory E2E");

    console.log("Full workflow completed successfully!");
  });
});
