import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import buble from '@rollup/plugin-buble';
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import manifestJson from 'rollup-plugin-manifest-json';
import manifestData from './public/manifest.json';

const isChrome = process.env.TARGET_BROWSER === 'chrome';
const outDir = 'dist/' + (process.env.TARGET_BROWSER || 'chrome');

const manifestSpecData = isChrome? {
  "manifest_version": 3,
  "permissions": manifestData["permissions"].concat("scripting"),
  "background": {
    "service_worker": "background.js"
  },
  "browser_action": undefined,
  "action": manifestData["browser_action"],
  "web_accessible_resources": [{
    "resources": manifestData["web_accessible_resources"],
    "matches": ["<all_urls>"]
  }]
} : {};

export default {
  input: {
    background: 'src/background.js',
    content: 'src/content.js',
    connection: 'src/connection.js'
  },
  output: {
    dir: outDir,
    format: 'cjs'
  },
  plugins: [
    replace({
      'process.env.CHROME': JSON.stringify(isChrome),
    }),
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
      targets: [
        {
          src: ['public/**/*', '!public/manifest.json' ],
          dest: outDir
        }
      ]
    }),
    manifestJson({
      input: 'public/manifest.json',
      manifest: manifestSpecData
    })
  ]
};
