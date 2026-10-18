const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ============================================
// CONFIGURAÇÃO DO BANCO DE DADOS SQLITE
// ============================================
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) console.error("Erro ao abrir o banco:", err.message);
  else console.log("📦 Conectado ao banco de dados SQLite.");
});

// Cria as tabelas se não existirem
db.serialize(() => {
  // Tabela de Produtos (Lanches Prontos)
  db.run(`CREATE TABLE IF NOT EXISTS produtos (
        id TEXT PRIMARY KEY,
        nome TEXT,
        preco REAL
    )`);

  // Tabela de Reservas
  db.run(`CREATE TABLE IF NOT EXISTS reservas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        telefone TEXT,
        data TEXT,
        pessoas INTEGER,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

  // Insere os produtos iniciais se a tabela estiver vazia
  db.get("SELECT COUNT(*) as count FROM produtos", (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO produtos VALUES (?, ?, ?)");
      stmt.run("classico", "Clássico", 24.9);
      stmt.run("bacon", "Bacon", 28.9);
      stmt.run("veggie", "Veggie", 26.9);
      stmt.run("combo", "Combo Fritas + Refri", 12.9);
      stmt.finalize();
      console.log("🌱 Preços iniciais inseridos no banco.");
    }
  });
});

// ============================================
// ROTAS DA API (ENDPOINTS)
// ============================================

// 1. Buscar todos os produtos (usado pelo index.html)
app.get("/api/produtos", (req, res) => {
  db.all("SELECT * FROM produtos", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 2. Atualizar o preço de um produto (usado pelo admin.html)
app.put("/api/produtos/:id", (req, res) => {
  const { preco } = req.body;
  const { id } = req.params;

  db.run(
    "UPDATE produtos SET preco = ? WHERE id = ?",
    [preco, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Preço atualizado com sucesso!" });
    },
  );
});

// 3. Criar uma nova reserva (usado pelo index.html)
app.post("/api/reservas", (req, res) => {
  const { nome, telefone, data, pessoas } = req.body;

  db.run(
    "INSERT INTO reservas (nome, telefone, data, pessoas) VALUES (?, ?, ?, ?)",
    [nome, telefone, data, pessoas],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res
        .status(201)
        .json({ message: "Reserva salva no banco!", id: this.lastID });
    },
  );
});

// 4. Listar todas as reservas (útil para o dono do restaurante ver)
app.get("/api/reservas", (req, res) => {
  db.all("SELECT * FROM reservas ORDER BY criado_em DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

// 5. Apagar uma reserva (Cancelamento)
app.delete("/api/reservas/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM reservas WHERE id = ?", id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Reserva não encontrada." });

    res.json({ message: "Reserva cancelada com sucesso!" });
  });
});
