import babel from '@babel/core'
import fs from 'fs'
import path from 'path'

/**
 * @param {{ 
 *    filter?: RegExp, 
 *    namespace?: string, 
 *    config?: import('@babel/core').TransformOptions, 
 *    loader?: string | ((path: string) => string) 
 * }} options
 */
export const esbuildPluginBabel = (options = {}) => ({
	name: 'babel',
	setup(build) {
		const { filter = /.*/, namespace = '', config = {}, loader } = options

		const resolveLoader = (args)=> {
			if (typeof loader === 'function') {
				return loader(args.path)
			}
			return loader
		}

		const transformContents = async (args, contents) => {
			const babelOptions = babel.loadOptions({
				filename: args.path,
				...config,
				caller: {
					name: 'esbuild-plugin-babel',
					supportsStaticESM: true
				}
			})

			if (!babelOptions) {
				return { contents, loader: resolveLoader(args) }
			}

			if (babelOptions.sourceMaps) {
				babelOptions.sourceFileName = path.relative(process.cwd(), args.path)
			}

			return new Promise((resolve, reject) => {
				babel.transform(contents, babelOptions, (error, result) => {
					error
						? reject(error)
						: resolve({
							contents: result?.code ?? '',
							loader: resolveLoader(args),
						})
				})
			})
		}

		build.onLoad({ filter, namespace }, async args => {
			const contents = await fs.promises.readFile(args.path, 'utf8')

			return transformContents(args, contents)
		})
	}
})