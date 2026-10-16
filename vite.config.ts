import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages（https://kyamada-gif.github.io/kankouji-game/）で公開するため
  base: '/kankouji-game/',
})
