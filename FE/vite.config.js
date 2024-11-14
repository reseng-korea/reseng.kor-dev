import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/oauth2': {
        target: 'https://reseng.co.kr',
        changeOrigin: true,
        secure: false, // SSL 인증서 문제가 있을 경우 추가
      },
    },
  },
});
