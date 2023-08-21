import path from 'path'
import { defineConfig } from 'vite'
import domReactivityPlugin from 'vite-plugin-dom-reactivity'

export default defineConfig({
  plugins: [
    domReactivityPlugin()
  ],
  // define an alias @ to project root (required by dom-reactivity)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
      'pages': path.resolve(__dirname, './src/pages'),
      'lib': path.resolve(__dirname, './src/lib'),
    }
  }
})