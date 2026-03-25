
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use a type assertion to fix 'Property cwd does not exist on type Process' error.
  // process.cwd() is provided by the Node.js runtime environment during the build/config process.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.API_KEY || ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.API_KEY || '')
    },
    server: {
      host: true,
      port: 3000
    }
  };
});
