import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH dùng khi deploy lên GitHub Pages (ví dụ: /20-10-bo-hoa/)
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.API_TARGET || 'http://localhost:5174',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1600,
  },
})
