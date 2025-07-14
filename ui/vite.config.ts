import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // Proxy /api requests to your backend server
      '/api': {
        target: 'http://backend:3000', // Your backend server address
        changeOrigin: true,
        // secure: false, // If your backend is not HTTPS
        // rewrite: (path) => path.replace(/^\/api/, '') // if your backend doesn't expect /api prefix
      },
    },
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
