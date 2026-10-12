import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // приложение раздаётся из подпапки (publicPath в webpack.config.js)
    baseUrl: 'http://localhost:4000/burger-shop',
  },
});
