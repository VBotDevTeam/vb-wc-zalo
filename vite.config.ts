import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
// export default defineConfig({
//   base: './',
//   esbuild: {
//     jsxFactory: 'h',
//     jsxFragment: 'h.f',
//     jsxInject: 'import { h } from "omi"',
//   },
//   resolve: {
//     alias: {
//       'omi-elements': path.resolve('./src/lib/index.tsx'),
//       '@': path.resolve('./src/'),
//     },
//   },
// })

export default defineConfig({
  base: './',
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'h.f',
    jsxInject: 'import { h } from "omi"',
  },
  resolve: {
    alias: {
      'omi-elements': path.resolve('./src/lib/index.tsx'),
      '@': path.resolve('./src/'),
    },
  },
  server: {
    proxy: {
      '/zalo-api': {
        target: 'https://api-sandbox-h01.vbot.vn/v1.0',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/zalo-api/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err)
          })
        },
      },
    },
  },
})
