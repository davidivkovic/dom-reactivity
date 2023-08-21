import jsxTransform from '../babel-plugin-jsx-dom-expressions'

let generate = "dom"
let production = true

export function setPresetMode(mode) {
  generate = mode ?? "dom"
}

export function setProductionMode(mode) {
  production = mode ?? true
}

function moduleName() {
  if (production) {
    return generate === 'dom' ? 'dom-reactivity' : 'dom-reactivity/ssr'
  }
  return generate === 'dom' ? '/src/client.js' : '/src/server.js'
}

export default function (context, options = {}) {
  return {
    plugins: [
      [
        jsxTransform,
        {
          // This points to: runtime/src/client.js, rebuild "vite-plugin" after changing this
          // moduleName: generate === 'dom' ? '/src/client.js' : '/src/server.js', // for runtime development
          // moduleName: generate === 'dom' ? 'dom-reactivity' : 'dom-reactivity/ssr', // for release (npm)
          moduleName: moduleName(),
          builtIns: ["If", "For"],
          generate,
          ...options
        }
      ]
    ]
  }
}