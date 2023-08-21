import cjs from '@rollup/plugin-commonjs'
import cleaner from 'rollup-plugin-cleaner'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'

const extensions = ['.js', '.ts', '.json', '.tsx', '.jsx']

const external = [
  '@babel/core',
  '@babel/preset-typescript',
  'vite'
]

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'index.js',
  output: [
    {
      format: 'esm',
      file: 'dist/esm/index.mjs',
      sourcemap: true
    },
    // {
    //   format: 'cjs',
    //   file: 'dist/cjs/index.cjs',
    //   sourcemap: true,
    //   exports: 'default'
    // }
  ],
  external,
  plugins: [
    cleaner({ targets: ['./dist/'] }),
    babel({
      extensions,
      babelHelpers: 'bundled',
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' }, modules: 'auto' }]
      ]
    }),
    nodeResolve({ extensions, preferBuiltins: true, browser: false }),
    cjs({ extensions })
  ]
}

export default config