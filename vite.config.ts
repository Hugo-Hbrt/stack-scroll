import { defineConfig } from 'vite'
import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    enviroment: 'jsdom'
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, 'src/components'),
    }
  }
} as UserConfig)
