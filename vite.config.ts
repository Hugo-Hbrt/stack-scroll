import 'dotenv/config';
import { defineConfig } from 'vite'
import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';
import svgr from 'vite-plugin-svgr';

const svgrOptions = {
  svgrOptions: {
    icon: true,
    typescript: false, // Keep false to avoid build error
  },
  include: '**/*.svg',
};

// Read URL from .env file
const url = process.env.VITE_BASE_URL;
console.log('Vite server started at:', url);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr(svgrOptions)],
  server: {
    port: 5173, // Ensure Vite runs on port 5173
    open: url, // Open the Ngrok URL in the browser
    allowedHosts: [
      url?.replace(/https?:\/\//, ''), // Remove protocol for allowedHosts
    ],
  },
  test: {
    environment: 'jsdom'
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, 'src/components'),
      "@assets": path.resolve(__dirname, 'src/assets'),
      "@utils": path.resolve(__dirname, 'src/utils'),
      "@pages": path.resolve(__dirname, 'src/pages'),
      "@models": path.resolve(__dirname, 'src/models'),
      "@config": path.resolve(__dirname, 'src/config'),
      "@store": path.resolve(__dirname, 'src/store'),
    }
  }
} as UserConfig)
