import flow from 'rollup-plugin-flow'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/cli.js',
  output: {
    file: 'build/sussex.js',
    format: 'cjs'
  },
  plugins: [
    flow(),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
};