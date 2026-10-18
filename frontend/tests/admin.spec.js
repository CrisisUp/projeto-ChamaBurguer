const { test, expect } = require("@playwright/test");

test.describe("Painel Administrativo", () => {
  test("Deve fazer login e alterar o preço do Bacon", async ({ page }) => {
    // 1. Acessa a página de login
    await page.goto("http://localhost:3000/login.html");

    // 2. Digita a senha correta
    await page.locator("#senha").fill("chama2026");
    await page.locator('button[type="submit"]').click();

    // 3. Verifica se foi redirecionado para o admin
    await expect(page).toHaveURL(/admin(\.html)?$/);

    // 4. Localiza o input do Bacon e altera o preço
    const inputBacon = page.locator(
      'input[data-categoria="adicionais"][data-index="0"]',
    );
    await inputBacon.fill("6.50");
    await page.locator("#btnSalvar").click();

    // 5. Verifica se foi salvo no localStorage
    const precoSalvo = await page.evaluate(() => {
      const dados = JSON.parse(localStorage.getItem("chamaBurguer_precos"));
      return dados.adicionais[0].preco;
    });
    expect(precoSalvo).toBe(6.5);
  });
});
