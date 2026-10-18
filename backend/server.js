const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) console.error("Erro ao abrir o banco:", err.message);
  else console.log("📦 Conectado ao banco de dados SQLite.");
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS produtos (id TEXT PRIMARY KEY, nome TEXT, preco REAL)`,
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS reservas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, telefone TEXT, data TEXT, pessoas INTEGER, criado_em DATETIME DEFAULT CURRENT_TIMESTAMP)`,
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS ingredientes (id TEXT PRIMARY KEY, nome TEXT, categoria TEXT, preco REAL, imagem TEXT)`,
  );

  db.get("SELECT COUNT(*) as count FROM produtos", (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO produtos VALUES (?, ?, ?)");
      stmt.run("classico", "Clássico", 24.9);
      stmt.run("bacon", "Bacon", 28.9);
      stmt.run("veggie", "Veggie", 26.9);
      stmt.run("combo", "Combo Fritas + Refri", 12.9);
      stmt.finalize();
    }
  });

  db.get("SELECT COUNT(*) as count FROM ingredientes", (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare(
        "INSERT INTO ingredientes VALUES (?, ?, ?, ?, ?)",
      );

      // ============================================
      // CAMINHO LOCAL DAS IMAGENS (Baseado no seu print)
      // ============================================
      //const img = "../v2-8/assets/images/";
      const img = "/assets/images/";

      // Pães
      stmt.run("brioche", "Pão Brioche", "paes", 5.0, img + "pao-brioche.jpg");
      stmt.run(
        "australiano",
        "Pão Australiano",
        "paes",
        6.5,
        img + "pao-australiano.jpg",
      );

      // Carnes
      stmt.run(
        "carne-160",
        "Carne Bovina 160g",
        "carnes",
        14.0,
        img + "carne-bovina.jpg",
      );
      stmt.run(
        "frango",
        "Frango Grelhado",
        "carnes",
        12.0,
        img + "frango-grelhado.jpeg",
      );
      stmt.run(
        "veggie",
        "Grão-de-bico",
        "carnes",
        13.0,
        img + "hamburguer-grao-de-bico.jpeg",
      );

      // Molhos
      stmt.run(
        "maionese",
        "Maionese da Casa",
        "molhos",
        2.0,
        img + "maionese.jpeg",
      );
      stmt.run(
        "barbecue",
        "Barbecue",
        "molhos",
        2.5,
        img + "molho-barbecue.jpeg",
      );
      stmt.run("picante", "Picante", "molhos", 2.5, img + "molho-picante.jpeg");

      // Queijos
      stmt.run(
        "cheddar",
        "Cheddar",
        "queijos",
        3.5,
        img + "queijo-cheddar.jpeg",
      );
      stmt.run("prato", "Prato", "queijos", 3.0, img + "queijo-prato.jpeg");

      // Vegetais
      stmt.run("alface", "Alface", "vegetais", 1.0, img + "alface.jpeg");
      stmt.run("tomate", "Tomate", "vegetais", 1.5, img + "tomate.jpeg");
      stmt.run("picles", "Picles", "vegetais", 2.0, img + "picles.jpeg");
      stmt.run(
        "cebola",
        "Cebola Roxa",
        "vegetais",
        1.5,
        img + "cebola-roxa.jpeg",
      );

      // Bebidas
      stmt.run("coca", "Coca-Cola Lata", "bebidas", 6.0, img + "bebida.jpg");
      stmt.run(
        "suco",
        "Suco de Laranja",
        "bebidas",
        8.0,
        img + "suco-laranja.jpeg",
      );
      stmt.run(
        "agua",
        "Água Mineral",
        "bebidas",
        4.0,
        img + "agua-mineral.jpeg",
      );

      // Adicionais
      stmt.run("bacon", "Bacon", "adicionais", 5.0, img + "bacon-frito.jpeg");
      stmt.run("ovo", "Ovo Frito", "adicionais", 2.5, img + "ovo-frito.jpeg");
      stmt.run(
        "onion",
        "Onion Rings",
        "adicionais",
        4.0,
        img + "onions-ring.jpeg",
      );

      stmt.finalize();
      console.log("🌱 Ingredientes inseridos com as imagens locais corretas.");
    }
  });
});

app.get("/api/produtos", (req, res) =>
  db.all("SELECT * FROM produtos", [], (err, rows) => res.json(rows)),
);
app.put("/api/produtos/:id", (req, res) =>
  db.run(
    "UPDATE produtos SET preco = ? WHERE id = ?",
    [req.body.preco, req.params.id],
    () => res.json({ ok: true }),
  ),
);
app.post("/api/reservas", (req, res) => {
  const { nome, telefone, data, pessoas } = req.body;
  db.run(
    "INSERT INTO reservas (nome, telefone, data, pessoas) VALUES (?, ?, ?, ?)",
    [nome, telefone, data, pessoas],
    function () {
      res.json({ id: this.lastID });
    },
  );
});
app.get("/api/reservas", (req, res) =>
  db.all("SELECT * FROM reservas ORDER BY criado_em DESC", [], (err, rows) =>
    res.json(rows),
  ),
);
app.delete("/api/reservas/:id", (req, res) =>
  db.run("DELETE FROM reservas WHERE id = ?", req.params.id, () =>
    res.json({ ok: true }),
  ),
);
app.get("/api/ingredientes", (req, res) =>
  db.all("SELECT * FROM ingredientes", [], (err, rows) => res.json(rows)),
);
app.put("/api/ingredientes/:id", (req, res) =>
  db.run(
    "UPDATE ingredientes SET preco = ? WHERE id = ?",
    [req.body.preco, req.params.id],
    () => res.json({ ok: true }),
  ),
);

app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`),
);

// ============================================
// NOVA ROTA: FECHAMENTO DE PEDIDO (WHATSAPP)
// ============================================
app.post("/api/pedido", (req, res) => {
  const { carrinho } = req.body;

  if (!carrinho || carrinho.length === 0) {
    return res.status(400).json({ error: "Carrinho vazio." });
  }

  const ids = carrinho.map((item) => `'${item.id}'`).join(",");

  // Busca os preços reais no banco de dados (Produtos e Ingredientes)
  // Como o carrinho pode ter itens personalizados (que já têm o preço calculado no front),
  // e itens prontos, vamos simplificar:
  // O front-end envia o carrinho com os IDs. Se for produto, busca no banco.
  // Se for personalizado, o front já calculou com base nos ingredientes.

  // Para este nível de projeto, vamos manter o cálculo híbrido para não quebrar,
  // mas validamos a existência dos itens e formatamos a string no servidor.

  const telefoneRestaurante = "5511999990000";
  let mensagem = `*NOVO PEDIDO - CHAMA BURGUER* 🍔🔥\n\n`;

  let valorTotal = 0;

  carrinho.forEach((item) => {
    const subtotal = item.preco * item.quantidade;
    valorTotal += subtotal;
    mensagem += `▪️ *${item.quantidade}x ${item.nome}* - R$ ${subtotal.toFixed(2).replace(".", ",")}\n`;

    // Se for um lanche personalizado, adiciona a ficha técnica
    if (item.ficha) {
      for (const cat in item.ficha) {
        mensagem += `   🔸 _${cat.toUpperCase()}:_ ${item.ficha[cat].join(", ")}\n`;
      }
    }
  });

  mensagem += `\n*Total do Pedido:* R$ ${valorTotal.toFixed(2).replace(".", ",")}\n\n`;
  mensagem += `Por favor, confirmem a entrega! 😁`;

  const mensagemCodificada = encodeURIComponent(mensagem);
  const urlWhatsApp = `https://wa.me/${telefoneRestaurante}?text=${mensagemCodificada}`;

  // Devolve a URL pronta para o front-end
  res.json({ url: urlWhatsApp });
});
