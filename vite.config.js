import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  preview: {
    allowedHosts: [
      'navomesh-hackthon-frontend.onrender.com',
      'expense-tracker-frontend.onrender.com'
    ]
  }
})
