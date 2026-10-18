// Importa as funções puras do arquivo utils.js
import { formatarMoeda, formatarTelefone } from "./utils.js";

// ============================================
// 0. DARK MODE (TEMA ESCURO)
// ============================================
const btnTema = document.getElementById("btnTema");
const body = document.body;

const temaSalvo = localStorage.getItem("chamaBurguer_tema");
if (temaSalvo === "dark") {
  body.classList.add("dark-mode");
  if (btnTema) btnTema.textContent = "☀️";
}

if (btnTema) {
  btnTema.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
      btnTema.textContent = "☀️";
      localStorage.setItem("chamaBurguer_tema", "dark");
    } else {
      btnTema.textContent = "🌙";
      localStorage.setItem("chamaBurguer_tema", "light");
    }
  });
}

// ============================================
// 1. MENU MOBILE
// ============================================
const menuAbrir = document.getElementById("menuAbrir");
const menuLinks = document.getElementById("menuLinks");

if (menuAbrir && menuLinks) {
  menuAbrir.addEventListener("click", (e) => {
    e.stopPropagation();
    menuLinks.classList.toggle("ativo");
  });
  menuLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => menuLinks.classList.remove("ativo"));
  });
  document.addEventListener("click", (e) => {
    if (
      menuLinks.classList.contains("ativo") &&
      !menuLinks.contains(e.target) &&
      e.target !== menuAbrir
    ) {
      menuLinks.classList.remove("ativo");
    }
  });
}

// ============================================
// 2. NOTIFICAÇÕES (TOAST)
// ============================================
const toastContainer = document.getElementById("toastContainer");

function mostrarToast(mensagem, icone = "🍔", tipo = "sucesso") {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = `toast toast-${tipo}`;
  toast.innerHTML = `<span class="toast-icone">${icone}</span> <span>${mensagem}</span>`;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add("ativo"), 10);

  setTimeout(() => {
    toast.classList.remove("ativo");
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ============================================
// 3. MÁSCARA DE TELEFONE
// ============================================
const inputTelefone = document.getElementById("telefone");
if (inputTelefone) {
  inputTelefone.addEventListener("input", (e) => {
    e.target.value = formatarTelefone(e.target.value);
  });
}

// ============================================
// 4. FORMULÁRIO DE RESERVA (INTEGRAÇÃO COM O BACKEND)
// ============================================
const formReserva = document.getElementById("formReserva");
if (formReserva) {
  formReserva.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const dataInput = document.getElementById("data").value;
    const pessoas = document.getElementById("pessoas").value;

    if (!nome || !telefone || !dataInput) {
      mostrarToast(
        "Por favor, preencha todos os campos obrigatórios.",
        "⚠️",
        "erro",
      );
      return;
    }

    // Mostra um Toast de "Processando..."
    mostrarToast("Enviando sua reserva...", "⏳", "sucesso");

    try {
      // Envia a reserva para a API do Node.js
      const resposta = await fetch("http://localhost:3001/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome,
          telefone: telefone,
          data: dataInput,
          pessoas: parseInt(pessoas),
        }),
      });

      if (resposta.ok) {
        const [ano, mes, dia] = dataInput.split("-");
        const dataFormatada = `${dia}/${mes}/${ano}`;
        mostrarToast(
          `Reserva confirmada para ${nome}, no dia ${dataFormatada}!`,
          "✅",
          "sucesso",
        );
        formReserva.reset();
      } else {
        throw new Error("Erro ao salvar no servidor");
      }
    } catch (erro) {
      console.error(erro);
      mostrarToast(
        "Servidor offline. Tente novamente mais tarde.",
        "⚠️",
        "erro",
      );
    }
  });
}

// ============================================
// 5. CARRINHO E LÓGICA DE ESTADO
// ============================================
let carrinho = JSON.parse(localStorage.getItem("chamaBurguer_carrinho")) || [];

const carrinhoSidebar = document.getElementById("carrinhoSidebar");
const carrinhoOverlay = document.getElementById("carrinhoOverlay");
const btnFechar = document.getElementById("fecharCarrinho");
const carrinhoRodape = document.getElementById("carrinhoRodape");
const carrinhoTexto = document.getElementById("carrinhoTexto");
const carrinhoItensContainer = document.getElementById("carrinhoItens");
const carrinhoTotalValor = document.getElementById("carrinhoTotalValor");
const btnFinalizar = document.getElementById("btnFinalizar");

function atualizarInterfaceCarrinho() {
  let totalItens = 0;
  let valorTotal = 0;

  carrinho.forEach((item) => {
    totalItens += item.quantidade;
    valorTotal += item.preco * item.quantidade;
  });

  const textoItens = totalItens === 1 ? "item" : "itens";
  if (carrinhoTexto)
    carrinhoTexto.textContent = `${totalItens} ${textoItens} · ${formatarMoeda(valorTotal)}`;
  if (carrinhoTotalValor)
    carrinhoTotalValor.textContent = formatarMoeda(valorTotal);

  if (carrinhoItensContainer) {
    carrinhoItensContainer.innerHTML = "";
    if (carrinho.length === 0) {
      carrinhoItensContainer.innerHTML =
        '<p class="carrinho-vazio">Seu carrinho está vazio 🍔<br>Adicione itens do cardápio!</p>';
    } else {
      carrinho.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("item-carrinho");
        div.innerHTML = `
                    <div class="item-carrinho-info">
                        <h4>${item.nome}</h4>
                        <span class="preco-unitario">${formatarMoeda(item.preco)} un.</span>
                    </div>
                    <div class="item-carrinho-controles">
                        <span class="qtd">${item.quantidade}x</span>
                        <button class="btn-remover" data-index="${index}" title="Remover 1 unidade">🗑️</button>
                    </div>
                `;
        carrinhoItensContainer.appendChild(div);
      });
    }
  }

  localStorage.setItem("chamaBurguer_carrinho", JSON.stringify(carrinho));

  document.querySelectorAll(".btn-remover").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.getAttribute("data-index"));
      removerDoCarrinho(index);
    });
  });
}

function adicionarAoCarrinho(nome, preco) {
  const itemExistente = carrinho.find((item) => item.nome === nome);
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ nome, preco, quantidade: 1 });
  }
  atualizarInterfaceCarrinho();
  mostrarToast(`${nome} adicionado!`, "🍔", "sucesso");
}

function removerDoCarrinho(index) {
  if (carrinho[index].quantidade > 1) {
    carrinho[index].quantidade -= 1;
  } else {
    carrinho.splice(index, 1);
  }
  atualizarInterfaceCarrinho();
}

document.querySelectorAll(".adicionar-carrinho").forEach((botao) => {
  botao.addEventListener("click", () => {
    const nome = botao.dataset.name;
    const preco = parseFloat(botao.dataset.preco);
    if (!isNaN(preco)) {
      adicionarAoCarrinho(nome, preco);
    } else {
      mostrarToast("Erro ao adicionar item.", "⚠️", "erro");
    }
  });
});

if (carrinhoRodape && carrinhoSidebar && carrinhoOverlay) {
  carrinhoRodape.addEventListener("click", () => {
    carrinhoSidebar.classList.add("ativo");
    carrinhoOverlay.classList.add("ativo");
  });
}

function fecharSidebar() {
  if (carrinhoSidebar) carrinhoSidebar.classList.remove("ativo");
  if (carrinhoOverlay) carrinhoOverlay.classList.remove("ativo");
}

if (btnFechar) btnFechar.addEventListener("click", fecharSidebar);
if (carrinhoOverlay) carrinhoOverlay.addEventListener("click", fecharSidebar);

if (btnFinalizar) {
  btnFinalizar.addEventListener("click", () => {
    if (carrinho.length === 0) {
      mostrarToast("Seu carrinho está vazio!", "⚠️", "erro");
      return;
    }

    const telefoneRestaurante = "5511999990000";
    let mensagem = `*NOVO PEDIDO - CHAMA BURGUER* 🍔🔥\n\n`;

    carrinho.forEach((item) => {
      const subtotal = item.preco * item.quantidade;
      mensagem += `▪️ *${item.quantidade}x ${item.nome}* - ${formatarMoeda(subtotal)}\n`;
    });

    let valorTotal = carrinho.reduce(
      (acc, item) => acc + item.preco * item.quantidade,
      0,
    );
    mensagem += `\n*Total do Pedido:* ${formatarMoeda(valorTotal)}\n\n`;
    mensagem += `Por favor, confirmem a entrega! 😁`;

    const mensagemCodificada = encodeURIComponent(mensagem);
    window.open(
      `https://wa.me/${telefoneRestaurante}?text=${mensagemCodificada}`,
      "_blank",
    );
  });
}

// ============================================
// 6. FAVORITOS (CORAÇÃO)
// ============================================
let favoritos =
  JSON.parse(localStorage.getItem("chamaBurguer_favoritos")) || [];
const botoesFavoritar = document.querySelectorAll(".btn-favoritar");

botoesFavoritar.forEach((botao) => {
  const card = botao.closest(".cardapio-item");
  if (!card) return;
  const idProduto = card.dataset.id;

  if (favoritos.includes(idProduto)) {
    botao.classList.add("favoritado");
    botao.textContent = "♥";
  }

  botao.addEventListener("click", () => {
    if (favoritos.includes(idProduto)) {
      favoritos = favoritos.filter((id) => id !== idProduto);
      botao.classList.remove("favoritado");
      botao.textContent = "♡";
    } else {
      favoritos.push(idProduto);
      botao.classList.add("favoritado");
      botao.textContent = "♥";
    }
    localStorage.setItem("chamaBurguer_favoritos", JSON.stringify(favoritos));
  });
});

// ============================================
// 7. FILTROS DO CARDÁPIO
// ============================================
const botoesFiltro = document.querySelectorAll(".btn-filtro");
const itensCardapio = document.querySelectorAll(".cardapio-item");

botoesFiltro.forEach((botao) => {
  botao.addEventListener("click", () => {
    botoesFiltro.forEach((b) => b.classList.remove("ativo"));
    botao.classList.add("ativo");

    const filtro = botao.dataset.filtro;

    itensCardapio.forEach((item) => {
      if (filtro === "todos" || item.dataset.categoria === filtro) {
        item.classList.remove("escondido");
        setTimeout(() => (item.style.opacity = "1"), 50);
      } else {
        item.style.opacity = "0";
        setTimeout(() => item.classList.add("escondido"), 300);
      }
    });
  });
});

// ============================================
// 8. BUSCA NO CARDÁPIO
// ============================================
const campoBusca = document.getElementById("campoBusca");
if (campoBusca) {
  campoBusca.addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase();
    document.querySelectorAll(".cardapio-item").forEach((item) => {
      const nome = item.querySelector("h3").textContent.toLowerCase();
      if (nome.includes(termo)) {
        item.classList.remove("escondido");
      } else {
        item.classList.add("escondido");
      }
    });
  });
}

// ============================================
// 9. SCROLL REVEAL (ANIMAÇÕES)
// ============================================
const elementosParaAnimar = document.querySelectorAll(
  ".destaque-texto, .destaque-imagem, .cardapio h2, .cardapio-filtros, .sobre-imagem, .sobre-texto, .depoimentos h2, .depoimento, .reserva-container, .cta-conteudo",
);

elementosParaAnimar.forEach((el) => {
  el.classList.add("reveal");
  if (
    el.classList.contains("sobre-imagem") ||
    el.classList.contains("destaque-imagem")
  ) {
    el.classList.remove("reveal");
    el.classList.add("reveal-esquerda");
  }
  if (
    el.classList.contains("sobre-texto") ||
    el.classList.contains("destaque-texto")
  ) {
    el.classList.remove("reveal");
    el.classList.add("reveal-direita");
  }
});

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("ativo");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

document
  .querySelectorAll(".reveal, .reveal-esquerda, .reveal-direita")
  .forEach((el) => {
    observer.observe(el);
  });

// ============================================
// 10. BARRA DE PROGRESSO DE SCROLL
// ============================================
const barraProgresso = document.getElementById("barraProgresso");
if (barraProgresso) {
  window.addEventListener("scroll", () => {
    const alturaTotal =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const rolagemAtual = window.scrollY;
    const porcentagem = (rolagemAtual / alturaTotal) * 100;
    barraProgresso.style.width = `${porcentagem}%`;
  });
}

// ============================================
// 11. SCROLL SUAVE
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

// ============================================
// 12. ATUALIZAR PREÇOS DO CARDÁPIO VIA BACKEND (NODE.JS)
// ============================================
const produtosOriginais = [
  { id: "classico", nome: "Clássico", preco: 24.9 },
  { id: "bacon", nome: "Bacon", preco: 28.9 },
  { id: "veggie", nome: "Veggie", preco: 26.9 },
  { id: "combo", nome: "Combo Fritas + Refri", preco: 12.9 },
];

async function atualizarPrecosCardapio() {
  let produtos = produtosOriginais; // Define o padrão antes de tentar buscar

  try {
    // Tenta buscar os preços do Backend Node.js
    const resposta = await fetch("http://localhost:3001/api/produtos");
    if (resposta.ok) {
      produtos = await resposta.json();
    }
  } catch (erro) {
    console.warn("Servidor offline. Usando preços locais de fallback.");
  }

  // Aplica os preços na tela
  document.querySelectorAll(".cardapio-item").forEach((card) => {
    const idProduto = card.dataset.id;
    const produtoInfo = produtos.find((p) => p.id === idProduto);

    if (produtoInfo) {
      const precoEl = card.querySelector(".preco");
      if (precoEl) precoEl.textContent = formatarMoeda(produtoInfo.preco);

      const btnAdd = card.querySelector(".adicionar-carrinho");
      if (btnAdd) btnAdd.dataset.preco = produtoInfo.preco;
    }
  });
}

// ============================================
// 13. INICIALIZAÇÃO GERAL
// ============================================
atualizarInterfaceCarrinho();
atualizarPrecosCardapio();
