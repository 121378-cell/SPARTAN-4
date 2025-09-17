import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import viteImagemin from 'vite-plugin-imagemin';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Enable source maps for production debugging
        sourcemap: mode === 'development',
        // Copy PWA files to dist
        assetsInlineLimit: 0,
        // Optimize chunk splitting
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
          },
          output: {
            // Chunk splitting strategy
            manualChunks: {
              // React ecosystem
              'react-vendor': ['react', 'react-dom'],
              // UI components and icons
              'ui-vendor': ['lucide-react'],
              // Charts and data visualization
              'charts-vendor': ['recharts'],
              // AI and API utilities
              'ai-vendor': ['@google/genai'],
            },
            // Optimize chunk names for caching
            chunkFileNames: (chunkInfo) => {
              const facadeModuleId = chunkInfo.facadeModuleId
                ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
                : 'chunk';
              return `assets/[name]-[hash].js`;
            },
            assetFileNames: (assetInfo) => {
              const extType = assetInfo.name?.split('.').pop();
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || '')) {
                return `assets/images/[name]-[hash].[ext]`;
              }
              if (/css/i.test(extType || '')) {
                return `assets/css/[name]-[hash].[ext]`;
              }
              return `assets/[name]-[hash].[ext]`;
            },
          },
        },
        // Optimize bundle size
        target: 'es2020',
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: mode === 'production',
            drop_debugger: mode === 'production',
          },
        },
        // Set chunk size warnings
        chunkSizeWarningLimit: 1000,
        // Ensure public files are copied
        copyPublicDir: true,
      },
      // Development optimizations
      server: {
        hmr: {
          overlay: true,
        },
      },
      // Add bundle analyzer in development
      plugins: mode === 'development' ? [
        visualizer({
          filename: 'dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
        })
      ] : [],
    };
});
