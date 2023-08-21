import { resolve } from 'path'
import { terser } from 'rollup-plugin-terser'
import { defineConfig } from 'vite'
import domReactivityPlugin from '../vite-plugin'

export default defineConfig({
  plugins: [
    domReactivityPlugin({ production: process.env.NODE_ENV === 'production' })
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: {
        server: resolve(__dirname, 'src/server.js'),
        client: resolve(__dirname, 'src/client.js'),
      },
      name: 'DomReactivity',
      // the proper extensions will be added
      fileName: (format, entry) => `dom-reactivity.${entry}.js`,
      formats: ['es'],
    },
    rollupOptions: {
      plugins: [
        terser({
          output: {
            beautify: false, // Remove line breaks and whitespace
          }
        })
      ],
    },
  },
})