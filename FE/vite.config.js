import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/oauth2' 경로는 백엔드 서버로 프록시
      '/oauth2': {
        target: 'https://reseng.co.kr',
        changeOrigin: true,
      },
      // '/api' 경로도 동일한 백엔드 서버로 프록시
      '/api': {
        target: 'https://reseng.co.kr',
        changeOrigin: true,
      },
    },
  },
});
