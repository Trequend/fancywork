import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import glsl from 'rollup-plugin-glsl';
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
    glsl({
      include: '**/*.glsl',
      sourceMap: false,
    }),
    typescript({ tsconfig: './tsconfig.json' }),
    nodeResolve(),
  ],
  external: Object.keys(pkg.peerDependencies || {}),
};

export default config;
