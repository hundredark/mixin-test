import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
// yarn add --dev @esbuild-plugins/node-modules-polyfill @esbuild-plugins/node-globals-polyfill
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig(({ mode }) => {
  return mode === 'production'
    ? {
        plugins: [
          vue(),
          nodePolyfills({
            // To exclude specific polyfills, add them to this list.
            exclude: [
              'fs', // Excludes the polyfill for `fs` and `node:fs`.
            ],
            // Whether to polyfill specific globals.
            globals: {
              Buffer: true, // can also be 'build', 'dev', or false
              global: true,
              process: true,
            },
            // Whether to polyfill `node:` protocol imports.
            protocolImports: true,
          }),
        ],
        resolve: {
          alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
          },
        },
      }
    : {
        plugins: [
          vue(),
        ],
        resolve: {
          alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            process: 'process/browser',
            stream: 'stream-browserify',
            zlib: 'browserify-zlib',
            util: 'util',
            buffer: 'Buffer',
          },
        },
        optimizeDeps: {
          esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
              global: 'globalThis',
            },
            // Enable esbuild polyfill plugins
            plugins: [
              NodeGlobalsPolyfillPlugin({
                process: true,
                buffer: true,
              }),
              NodeModulesPolyfillPlugin(),
            ],
          },
        },
        build: {
          rollupOptions: {
            plugins: [
              // Enable rollup polyfills plugin
              // used during production bundling
              rollupNodePolyFill(),
            ],
          },
        },
      };
});
