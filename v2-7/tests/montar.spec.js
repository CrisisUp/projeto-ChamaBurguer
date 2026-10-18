const { test, expect } = require("@playwright/test");

test.describe("Montagem de Lanche (montar.html)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/montar.html");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("Botão de adicionar deve estar desabilitado até escolher os obrigatórios", async ({
    page,
  }) => {
    const btnAdicionar = page.locator("#btnAdicionar");

    // Inicialmente deve estar desabilitado
    await expect(btnAdicionar).toBeDisabled();

    // Escolhe o Pão, a Carne e o Molho
    await page.locator("#grupo-paes .card-ingrediente").first().click();
    await page.locator("#grupo-carnes .card-ingrediente").first().click();
    await page.locator("#grupo-molhos .card-ingrediente").first().click();

    // Agora deve estar habilitado
    await expect(btnAdicionar).toBeEnabled();
  });

  test("Deve calcular o preço total corretamente", async ({ page }) => {
    // Pão Brioche (5.00) + Carne 160g (14.00) + Maionese (2.00) = 21.00
    await page.locator("#grupo-paes .card-ingrediente").first().click();
    await page.locator("#grupo-carnes .card-ingrediente").first().click();
    await page.locator("#grupo-molhos .card-ingrediente").first().click();

    // Verifica se o total exibido bate
    await expect(page.locator("#valorTotal")).toContainText("R$ 21,00");
  });
});
