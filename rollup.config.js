import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import buble from '@rollup/plugin-buble';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';

export default {
  input: {
    background: 'src/background.js',
    content: 'src/content.js',
    connection: 'src/connection.js'
  },
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    commonjs(),
    buble({
      transforms: { dangerousForOf: true },
      exclude: ['node_modules/**']
    }),
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true
      }
    }),
    copy({
      flatten: false,
      targets: [{ src: 'public/**/*', dest: 'dist' }]
    })
  ]
};
