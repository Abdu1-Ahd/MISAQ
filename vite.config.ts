import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'MISAQ e Amanat',
        short_name: 'MISAQ',
        description: 'A clear, trusted home for every Kameti.',
        theme_color: '#114b47',
        background_color: '#f9faf7',
        display: 'standalone',
        start_url: '/',
        icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
      workbox: { navigateFallback: '/', globPatterns: ['**/*.{js,css,html,svg,png,woff2}'] },
    }),
  ],
})
