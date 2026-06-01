import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      // Disable source maps for production builds to improve performance
      sourcemap: false,
      // Increase chunk size limit to reduce warnings
      chunkSizeWarningLimit: 1500,
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Minify with esbuild for faster builds
      minify: 'esbuild',
      // Target modern browsers for smaller output
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
                return 'vendor-react';
              }
              if (id.includes('motion') || id.includes('lucide-react') || id.includes('@tanstack')) {
                return 'vendor-ui';
              }
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('i18next') || id.includes('react-i18next')) {
                return 'vendor-i18n';
              }
              return 'vendor';
            }
          },
          // Better asset file naming for cache-busting
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'zustand',
        'motion/react',
        'lucide-react',
      ],
    },
  };
});
