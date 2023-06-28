/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/app/",
  server: {
    host: true,
    port: 5050,
    cors: false
  },
  plugins: [svelte()],
})
