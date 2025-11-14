import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react()],
  css:{
    postcss: './postcss.config.js',
  },
  preview: {port:443, host:true},
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@context': path.resolve(__dirname, './src/context'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@helpers': path.resolve(__dirname, './src/helpers'),
      '@validaciones': path.resolve(__dirname, './src/validaciones')
    }
  },
  build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'router-vendor': ['react-router-dom'],
        'form-vendor': ['react-hook-form'],
        'ui-vendor': ['sweetalert2', 'react-toastify', 'react-icons']
      }
    }
  }
}

});

