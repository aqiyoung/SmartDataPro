import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180, // 修改为新的端口号
    strictPort: false, // 允许自动分配端口
    host: '0.0.0.0', // 监听所有地址，允许局域网访问
    proxy: {
      '/api': {
        target: 'http://localhost:8006',
        changeOrigin: true
      }
    }
  }
})