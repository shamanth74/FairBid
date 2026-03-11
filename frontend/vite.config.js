import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    host: true, 
    port: 5173,
    allowedHosts: [
      "localhost",
      "192.168.1.15", 
      "https://uncautioned-unprovidentially-georgiann.ngrok-free.dev"
    ],
  },
})
