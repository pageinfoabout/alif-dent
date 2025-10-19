import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default {
  server: {
    host: true,
    hmr: { protocol: 'ws', host: 'localhost', port: 5173 }, // or clientPort: 5173
  },
}