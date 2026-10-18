import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node", // Roda no Node, sem precisar do navegador
    include: ["tests/unit/**/*.test.js"], // Procura apenas nesta pasta
  },
});
