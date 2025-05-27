import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        catalog: resolve(__dirname, 'pages/catalog.html'),
        about: resolve(__dirname, 'pages/about.html'),
        delivery: resolve(__dirname, 'pages/delivery.html'),
        account: resolve(__dirname, 'pages/account.html'),
        login: resolve(__dirname, 'pages/login.html'),
        developer: resolve(__dirname, 'pages/developer.html')
      }
    }
  }
})