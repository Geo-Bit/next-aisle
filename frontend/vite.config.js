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
      host: "localhost",
    },
  },
  define: {
    "process.env": {}, // This is to prevent errors if process.env is accidentally used
  },
});
