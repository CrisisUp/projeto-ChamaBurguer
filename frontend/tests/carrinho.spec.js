const { test, expect } = require("@playwright/test");

test.describe("Carrinho de Compras (index.html)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/index.html");
    // Limpa o carrinho antes de cada teste
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("Deve adicionar um item e atualizar o total no rodapé", async ({
    page,
  }) => {
    // Clica no primeiro botão "Adicionar ao pedido" (Clássico - R$ 24,90)
    await page.locator(".adicionar-carrinho").first().click();

    // Verifica se o texto do carrinho no rodapé atualizou
    const textoCarrinho = page.locator("#carrinhoTexto");
    await expect(textoCarrinho).toContainText("1 item · R$ 24,90");

    // Abre o carrinho lateral
    await page.locator("#carrinhoRodape").click();
    await expect(page.locator("#carrinhoSidebar")).toHaveClass(/ativo/);

    // Verifica se o item está listado
    await expect(page.locator(".item-carrinho-info h4")).toContainText(
      "Clássico",
    );
  });
});
