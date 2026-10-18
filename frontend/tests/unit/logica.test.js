import { describe, expect, it } from "vitest";
import {
  calcularTotalMontagem,
  formatarMoeda,
  formatarTelefone,
} from "../../utils.js";

describe("Funções de Lógica (Unitários)", () => {
  it("Deve formatar valores em Reais corretamente", () => {
    // 👇 Usa regex para ignorar o tipo de espaço (comum ou não separável)
    expect(formatarMoeda(24.9)).toMatch(/R\$\s?24,90/);
    expect(formatarMoeda(0)).toMatch(/R\$\s?0,00/);
    expect(formatarMoeda(1500.5)).toMatch(/R\$\s?1\.500,50/);
  });

  it("Deve calcular o preço total de uma montagem", () => {
    const montagem = {
      paes: { nome: "Brioche", preco: 5.0 },
      carnes: { nome: "Carne", preco: 14.0 },
      molhos: { nome: "Maionese", preco: 2.0 },
      queijos: [{ nome: "Cheddar", preco: 3.5 }],
      vegetais: [],
      bebidas: [],
      adicionais: [],
    };
    expect(calcularTotalMontagem(montagem)).toBe(24.5);
  });

  it("Deve validar a máscara de telefone", () => {
    expect(formatarTelefone("11999998888")).toBe("(11) 99999-8888");
    expect(formatarTelefone("1199998888")).toBe("(11) 9999-8888");
    expect(formatarTelefone("11")).toBe("(11");
  });
});
