import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: false },
  build: {
    // ECharts é grande por natureza; separado em um chunk próprio para o restante carregar rápido.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          echarts: ['echarts/core', 'echarts-for-react/lib/core'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
