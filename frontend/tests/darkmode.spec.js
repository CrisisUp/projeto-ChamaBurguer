const { test, expect } = require("@playwright/test");

test.describe("Dark Mode (index.html)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/index.html");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("Deve ativar o dark mode e persistir após reload", async ({ page }) => {
    const btnTema = page.locator("#btnTema");
    const body = page.locator("body");

    // Estado inicial (claro)
    await expect(body).not.toHaveClass(/dark-mode/);
    await expect(btnTema).toHaveText("🌙");

    // Clica para ativar o escuro
    await btnTema.click();
    await expect(body).toHaveClass(/dark-mode/);
    await expect(btnTema).toHaveText("☀️");

    // Recarrega a página
    await page.reload();
    await expect(body).toHaveClass(/dark-mode/);
  });
});
