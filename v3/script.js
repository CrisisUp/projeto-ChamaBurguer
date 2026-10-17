// ============================================
// 1. MENU MOBILE
// ============================================
const menuAbrir = document.getElementById("menuAbrir");
const menuLinks = document.getElementById("menuLinks");

if (menuAbrir && menuLinks) {
  menuAbrir.addEventListener("click", (e) => {
    e.stopPropagation();
    menuLinks.classList.toggle("ativo");
    const aberto = menuLinks.classList.contains("ativo");
    menuAbrir.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });

  menuLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuLinks.classList.remove("ativo");
      menuAbrir.setAttribute("aria-label", "Abrir menu");
    });
  });

  document.addEventListener("click", (e) => {
    if (
      menuLinks.classList.contains("ativo") &&
      !menuLinks.contains(e.target) &&
      e.target !== menuAbrir
    ) {
      menuLinks.classList.remove("ativo");
      menuAbrir.setAttribute("aria-label", "Abrir menu");
    }
  });
}

// ============================================
// 2. FORMULÁRIO DE RESERVA
// ============================================
const formReserva = document.getElementById("formReserva");
const reservaAviso = document.getElementById("reservaAviso");
const textoAviso = document.getElementById("textoAviso");

if (formReserva && reservaAviso) {
  formReserva.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const dataInput = document.getElementById("data").value;
    const pessoas = document.getElementById("pessoas").value;

    if (!nome || !telefone || !dataInput) {
      alert("Por favor, preencha nome, telefone e data.");
      return;
    }

    const [ano, mes, dia] = dataInput.split("-");
    const dataFormatada = `${dia}/${mes}/${ano}`;

    textoAviso.innerHTML = `Reserva confirmada para <strong>${nome}</strong>, ${pessoas} pessoa(s), no dia <strong>${dataFormatada}</strong>. Vamos te chamar por telefone pra confirmar!`;

    reservaAviso.hidden = false;
    reservaAviso.scrollIntoView({ behavior: "smooth", block: "center" });
    formReserva.reset();

    setTimeout(() => {
      reservaAviso.hidden = true;
    }, 8000);
  });
}

// ============================================
// 3. CARRINHO DE PEDIDOS (QUANTIDADE E VALOR)
// ============================================
let totalItens = 0;
let valorTotal = 0;

const carrinhoRodape = document.getElementById("carrinhoRodape");
const carrinhoTexto = document.getElementById("carrinhoTexto");

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function atualizarCarrinho() {
  if (carrinhoTexto) {
    const textoItens = totalItens === 1 ? "item" : "itens";
    carrinhoTexto.textContent = `${totalItens} ${textoItens} · ${formatarMoeda(valorTotal)}`;
  }
}

if (carrinhoRodape) {
  carrinhoRodape.addEventListener("click", () => {
    if (totalItens === 0) {
      alert("Seu carrinho está vazio. Adicione itens do cardápio!");
    } else {
      alert(
        `Você tem ${totalItens} item(ns) no pedido.\nTotal: ${formatarMoeda(valorTotal)}`,
      );
    }
  });
}

const botoesAdicionar = document.querySelectorAll(".adicionar-carrinho");

botoesAdicionar.forEach((botao) => {
  botao.addEventListener("click", () => {
    const nome = botao.dataset.name;
    const preco = parseFloat(botao.dataset.preco);

    totalItens++;
    valorTotal += preco;

    atualizarCarrinho();

    const textoOriginal = botao.textContent;
    botao.textContent = "✅ Adicionado!";
    botao.style.backgroundColor = "#f59e0b";
    botao.style.color = "#2b1a14";
    botao.disabled = true;

    setTimeout(() => {
      botao.textContent = textoOriginal;
      botao.style.backgroundColor = "";
      botao.style.color = "";
      botao.disabled = false;
    }, 1200);

    if (carrinhoRodape) {
      carrinhoRodape.style.transform = "scale(1.05)";
      setTimeout(() => {
        carrinhoRodape.style.transform = "scale(1)";
      }, 300);
    }
  });
});

// ============================================
// 4. SCROLL SUAVE
// ============================================
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (targetId === "#") return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

console.log("🔥 Chama Burguer carregado com sucesso!");
