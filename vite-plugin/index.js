import babel from '@babel/core'
import preset, { setPresetMode, setProductionMode  } from '../babel-preset'
import { esbuildPluginBabel } from './esBuildBabel.js'

const DEFAULT_FILTER = /\.jsx?$/

export default function domReactivityPlugin(
  { filter = DEFAULT_FILTER, apply, loader, generate, production } = {}
) {
  setPresetMode(generate)
  setProductionMode(production)
  return {
    name: 'dom-reactivity',
    apply,
    enforce: 'pre',
    config() {
			return {
				optimizeDeps: {
					esbuildOptions: {
						plugins: [
							esbuildPluginBabel({
								config: preset(),
								filter,
								loader,
							}),
						],
					},
				},
			};
		},
    transform(code, id) {
      const shouldTransform = filter.test(id)
      if (!shouldTransform) return

      const result = babel.transformSync(code, {
        presets: [preset]
      })

      return {
        code: result.code,
        map: result.map
      }
    }
  }
}