import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'


const env = process.env.NODE_ENV


const plugins = [
  resolve(),

  babel({
    babelrc: false,
    exclude: 'node_modules/**',
    presets: [
      'es2015-rollup',
      'react',
      'stage-0'
    ]
  }),

  replace({
    'process.env.NODE_ENV': JSON.stringify(env) // quote the value
  }),

  commonjs()
]


if (env === 'production') {
  plugins.push(uglify({
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      warnings: false
    }
  }))
}


const config = {
  input: 'src/index.js',
  output: {
    file: 'dist/react-zedux.js',
    format: 'umd'
  },
  name: 'ReactZedux',
  plugins,
  external: [ 'react', 'zedux' ],
  globals: {
    react: 'React',
    zedux: 'Zedux'
  }
}


export default config
