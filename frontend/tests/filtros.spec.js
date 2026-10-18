const { test, expect } = require("@playwright/test");

test.describe("Filtros e Favoritos (index.html)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/index.html");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("Deve filtrar apenas os lanches vegetarianos", async ({ page }) => {
    // Clica no filtro
    await page.locator('.btn-filtro[data-filtro="vegetarianos"]').click();

    // Espera a animação
    await page.waitForTimeout(400);

    // Deve mostrar apenas 1 item (Veggie)
    const itensVisiveis = page.locator(".cardapio-item:not(.escondido)");
    await expect(itensVisiveis).toHaveCount(1);
    await expect(itensVisiveis.first()).toContainText("Veggie");
  });

  test("Deve favoritar um lanche e persistir após recarregar a página", async ({
    page,
  }) => {
    // Clica no primeiro coração (Clássico)
    const coracao = page.locator(".btn-favoritar").first();
    await coracao.click();

    // Verifica se ficou favoritado
    await expect(coracao).toHaveClass(/favoritado/);
    await expect(coracao).toHaveText("♥");

    // Recarrega a página (o localStorage deve manter)
    await page.reload();
    const coracaoAposReload = page.locator(".btn-favoritar").first();
    await expect(coracaoAposReload).toHaveClass(/favoritado/);
  });
});
