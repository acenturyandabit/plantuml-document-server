import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
const BACKEND_PORT = 3039;
export default defineConfig({
  plugins: [tsconfigPaths()],
  server: {
    proxy: {
      "/generate-uml": {
        target: `http://localhost:${BACKEND_PORT}/`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
