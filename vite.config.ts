import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      react(),
      tailwindcss(),
      isProduction &&
        visualizer({
          filename: 'dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@aurastone/schemas': path.resolve(__dirname, './packages/schemas/src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      host: process.env.HOST || 'localhost',
    },
    build: {
      sourcemap: !isProduction,
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      minify: 'esbuild',
      target: 'es2020',
      cssMinify: true,
      modulePreload: {
        polyfill: false,
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('i18next') || id.includes('react-i18next')) {
                return 'vendor-i18n';
              }
              if (id.includes('zustand')) {
                return 'vendor-state';
              }
              if (id.includes('zod')) {
                return 'vendor-validation';
              }
              if (id.includes('@radix-ui')) {
                return 'vendor-radix';
              }
              if (id.includes('date-fns') || id.includes('dayjs')) {
                return 'vendor-date';
              }
              // Core vendor: react, react-dom, motion, lucide, tanstack, scheduler
              if (
                id.includes('react') ||
                id.includes('react-dom') ||
                id.includes('scheduler') ||
                id.includes('motion') ||
                id.includes('lucide-react') ||
                id.includes('@tanstack')
              ) {
                return 'vendor';
              }
              return 'vendor';
            }
            return undefined;
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name ?? '';
            const info = name.split('.');
            const ext = info[info.length - 1] ?? '';
            if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(name)) {
              return `assets/images/[name]-[hash].${ext}`;
            }
            if (/\.(woff2?|eot|ttf|otf)$/.test(name)) {
              return `assets/fonts/[name]-[hash].${ext}`;
            }
            return `assets/[name]-[hash].${ext}`;
          },
        },
      },
      reportCompressedSize: true,
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'zustand',
        'motion/react',
        'lucide-react',
        '@tanstack/react-query',
        'zod',
      ],
      exclude: ['@google-cloud/vertexai'],
    },
    experimental: {
      renderBuiltUrl(filename, { hostType }) {
        if (hostType === 'js') {
          return { url: `/${filename}`, relative: true };
        }
        return { url: filename, relative: true };
      },
    },
  };
});
