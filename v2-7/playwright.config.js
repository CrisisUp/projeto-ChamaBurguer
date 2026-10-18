const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3000",
    headless: true, // Muda para false se quiser ver o navegador abrindo
  },
  webServer: {
    // Usa o npx serve para rodar o site localmente antes dos testes
    command: "npx serve -l 3000",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
