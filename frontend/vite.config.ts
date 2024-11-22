import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
const BACKEND_PORT = 3039;
export default defineConfig({
  plugins: [tsconfigPaths()],
  server: {
    proxy: {
      "/api": {
        target: `http://localhost:${BACKEND_PORT}/`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build:{
    outDir: "../backend/static",
    emptyOutDir: true,
  }
});
