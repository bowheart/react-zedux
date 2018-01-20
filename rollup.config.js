import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'


const env = process.env.NODE_ENV


const plugins = [
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
  })
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
  external: [ 'prop-types', 'react', 'zedux' ],
  globals: {
    'prop-types': 'PropTypes',
    react: 'React',
    zedux: 'Zedux'
  }
}


export default config
