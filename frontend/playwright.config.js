const { defineConfig } = require("@playwright/test");
const path = require("path");

module.exports = defineConfig({
  testDir: "./tests",
  testIgnore: "**/unit/**",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },
  webServer: [
    {
      command: "npx serve -l 3000 .", // Serve a pasta atual (frontend) na porta 3000
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      cwd: path.resolve(__dirname),
    },
    {
      command: "node server.js",
      url: "http://localhost:3001/api/produtos",
      reuseExistingServer: !process.env.CI,
      cwd: path.resolve(__dirname, "../backend"), // Aponta para a pasta backend
    },
  ],
});
