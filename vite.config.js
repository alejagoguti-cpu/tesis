import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Permite que funcione perfectamente en GitHub Pages y rutas relativas
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          three: ['three'],
          lucide: ['lucide-react'],
        },
      },
    },
  },
})
