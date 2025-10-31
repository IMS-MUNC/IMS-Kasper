import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Allow LAN access
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://192.168.1.26:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
