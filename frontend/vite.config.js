import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 8081,
    strictPort: true,
    hmr: {
      protocol: "ws",
      port: 3000,
    },
  },
  define: {
    "process.env": {
      REACT_APP_API_BASE_URL:
        process.env.REACT_APP_API_BASE_URL || "http://localhost:4000",
    },
  },
});
