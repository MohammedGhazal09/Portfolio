import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import compression from "vite-plugin-compression";
import { imagetools } from "vite-imagetools";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Image optimization - supports WebP, AVIF conversion and lazy loading
    imagetools({
      defaultDirectives: (url) => {
        if (url.searchParams.has('optimized')) {
          return new URLSearchParams({
            format: 'webp',
            quality: '80',
            w: '800;1200;1600',
          });
        }
        return new URLSearchParams();
      },
    }),
    // Gzip compression for production builds
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Brotli compression for production builds (better compression ratio)
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Target modern browsers for smaller bundle
    target: 'es2020',
    // Enable minification
    minify: 'esbuild',
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'sonner', 'next-themes'],
          'vendor-radix': [
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-slot',
            '@radix-ui/react-label',
          ],
          'vendor-3d': ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
}));
