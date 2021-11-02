import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
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
  plugins: [typescript({ tsconfig: './tsconfig.json' }), nodeResolve()],
  external: Object.keys(pkg.peerDependencies || {}),
};

export default config;
