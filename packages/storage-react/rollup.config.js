import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json';

const config = {
  input: 'lib/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  watch: {
    clearScreen: false,
    buildDelay: 300,
  },
  plugins: [
    {
      name: 'watch-external',
      buildStart() {
        const core = require.resolve('@fancywork/core');
        const storage = require.resolve('@fancywork/storage');
        this.addWatchFile(core);
        this.addWatchFile(storage);
      },
    },
    postcss({
      extract: path.resolve(__dirname, 'dist/main.css'),
      autoModules: true,
      modules: {
        generateScopedName: '[folder]_[local]__[hash:base64:5]',
        localsConvention: 'camelCaseOnly',
      },
    }),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    commonjs(),
    nodeResolve(),
  ],
  external: Object.keys(pkg.peerDependencies || {}),
};

export default config;
