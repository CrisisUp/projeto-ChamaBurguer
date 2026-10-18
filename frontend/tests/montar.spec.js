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
    await page.locator("#grupo-paes .card-ingrediente").first().click();
    await page.locator("#grupo-carnes .card-ingrediente").first().click();
    await page.locator("#grupo-molhos .card-ingrediente").first().click();

    await expect(page.locator("#valorTotal")).toContainText("R$ 21,00");
  });

  // 👇 ESTE É O TESTE NOVO, AGORA DENTRO DO BLOCO
  test("Deve carregar as imagens dos ingredientes e listar no resumo", async ({
    page,
  }) => {
    // 1. Verifica se as imagens dos pães foram renderizadas
    const imagemPao = page.locator("#grupo-paes .img-ingrediente").first();
    await expect(imagemPao).toBeVisible();

    // 2. Verifica se o src da imagem é válido
    const srcImagem = await imagemPao.getAttribute("src");
    expect(srcImagem).toContain("assets/images/");

    // 3. Seleciona Pão, Carne e Molho
    await page.locator("#grupo-paes .card-ingrediente").first().click();
    await page.locator("#grupo-carnes .card-ingrediente").first().click();
    await page.locator("#grupo-molhos .card-ingrediente").first().click();

    // 4. Verifica se o resumo lateral tem 3 itens
    const itensResumo = page.locator("#listaResumo li");
    await expect(itensResumo).toHaveCount(3);
  });
});
