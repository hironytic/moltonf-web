/// <reference types="vitest" />
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/moltonf-web/app/",
  build: {
    outDir: "dist/app"
  },
  server: {
    host: true,
    port: 5050,
    cors: false
  },
  plugins: [tailwindcss(), svelte()],
})
