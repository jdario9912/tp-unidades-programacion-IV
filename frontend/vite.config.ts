import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  resolve: {
    // @/ apunta a src/; el mismo alias se declara en tsconfig.app.json
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
})
