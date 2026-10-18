const { test, expect } = require("@playwright/test");

test.describe("Formulário de Reserva (index.html)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/index.html");
  });

  test("Deve aplicar a máscara de telefone corretamente", async ({ page }) => {
    const inputTelefone = page.locator("#telefone");

    // Simula um usuário digitando números
    await inputTelefone.fill("11999998888");

    // Verifica se o valor se tornou formatado
    await expect(inputTelefone).toHaveValue("(11) 99999-8888");
  });

  test("Deve exibir o Toast de sucesso ao reservar", async ({ page }) => {
    await page.locator("#nome").fill("João da Silva");
    await page.locator("#telefone").fill("11999998888");
    await page.locator("#data").fill("2026-12-25");
    await page.locator('button[type="submit"]').click();

    // Verifica se o Toast apareceu
    const toast = page.locator(".toast");
    await expect(toast).toHaveClass(/ativo/);
    await expect(toast).toContainText("Reserva confirmada");
  });
});
