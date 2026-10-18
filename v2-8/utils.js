// utils.js

export function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function calcularTotalMontagem(montagem) {
  let total = 0;
  for (const cat in montagem) {
    if (Array.isArray(montagem[cat])) {
      montagem[cat].forEach((i) => (total += i.preco));
    } else if (montagem[cat]) {
      total += montagem[cat].preco;
    }
  }
  return total;
}

export function formatarTelefone(valor) {
  let v = valor.replace(/\D/g, "");
  if (v.length > 10) return v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  if (v.length > 6)
    return v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  if (v.length > 2) return v.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  if (v.length > 0) return v.replace(/^(\d*)/, "($1");
  return v;
}
