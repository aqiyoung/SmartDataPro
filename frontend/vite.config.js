import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180, // 修改为新的端口号
    strictPort: true, // 严格使用指定端口，不自动分配
    host: '0.0.0.0', // 监听所有地址，允许局域网访问
    allowedHosts: true, // 允许所有域名访问，解决自定义域名被阻止问题
    proxy: {
      '/api': {
        target: 'http://localhost:8016',
        changeOrigin: true
      }
    }
  },
  // 构建优化配置
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        // 代码分割策略
        manualChunks: {
          // 将第三方库打包到独立的chunk
          'vendor': ['react', 'react-dom', 'axios'],
          // 将React相关库打包到独立的chunk
          'react-vendor': ['react', 'react-dom']
        }
      }
    },
    // 启用源映射
    sourcemap: false,
    // 优化构建大小
    minify: 'terser',
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 生成manifest文件，用于缓存控制
    manifest: true
  },
  // 静态资源优化
  optimizeDeps: {
    // 预构建依赖
    include: ['react', 'react-dom', 'axios'],
    // 禁用动态导入
    disableDynamicImport: false
  },
  // 缓存策略
  cacheDir: '.vite-cache'
})