import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 8081,
    strictPort: true,
  },
  define: {
    "process.env": {
      REACT_APP_API_BASE_URL:
        process.env.REACT_APP_API_BASE_URL || "https://localhost:4000",
    },
  },
});
