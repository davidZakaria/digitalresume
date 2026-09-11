import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use base: './' for Hostinger subfolders, or '/' for domain root.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
