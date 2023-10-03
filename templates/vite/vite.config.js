
import { defineConfig } from 'vite'
import domReactivityPlugin from 'vite-plugin-dom-reactivity'

export default defineConfig({
  plugins: [
    domReactivityPlugin()
  ],
})