import { defineConfig } from "vite";
export default defineConfig({
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        app: "./popup.html",
      },
    },
  },
  // server: {
  // 	open: "/popup.html",
  // },
  plugins: [
    {
      name: "deep-index",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/") {
            req.url = "/popup.html";
          }
          next();
        });
      },
    },
  ],
});
