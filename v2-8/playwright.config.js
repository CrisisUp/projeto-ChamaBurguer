const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  // 👇 Adicione esta linha para ignorar os testes unitários do Vitest
  testIgnore: "**/unit/**",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },
  webServer: {
    command: "npx serve -l 3000",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
