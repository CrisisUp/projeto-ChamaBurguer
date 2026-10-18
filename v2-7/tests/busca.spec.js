const { test, expect } = require("@playwright/test");

test.describe("Busca no Cardápio (index.html)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/index.html");
  });

  test("Deve filtrar os lanches ao digitar no campo de busca", async ({
    page,
  }) => {
    const campo = page.locator("#campoBusca");
    await campo.fill("bacon");
    await page.waitForTimeout(300);

    const itensVisiveis = page.locator(".cardapio-item:not(.escondido)");
    await expect(itensVisiveis).toHaveCount(1);
    await expect(itensVisiveis.first()).toContainText("Bacon");
  });

  test("Deve limpar a busca e mostrar todos novamente", async ({ page }) => {
    const campo = page.locator("#campoBusca");
    await campo.fill("bacon");
    await page.waitForTimeout(300);
    await campo.clear();
    await page.waitForTimeout(300);

    const itensVisiveis = page.locator(".cardapio-item:not(.escondido)");
    await expect(itensVisiveis).toHaveCount(4); // 4 lanches no total
  });
});
