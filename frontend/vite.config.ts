import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"


export default defineConfig(({ mode }) => {
  // Load environment variables based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  // Determine the API base URL
  let apiBaseUrl = 'http://localhost:8001';
  if (mode === 'network') {
    apiBaseUrl = 'http://10.16.38.127:8001';
  } else if (env.VITE_API_BASE_URL) {
    apiBaseUrl = env.VITE_API_BASE_URL;
  }
  
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: '0.0.0.0', // Allow connections from any IP
      port: 5173,
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false, // Set to false for HTTP
          rewrite: (path) => path
        }
      }
    }
  }
})