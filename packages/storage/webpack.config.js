const path = require('path');
const tsTransformPaths = require('@zerollup/ts-transform-paths');

module.exports = {
  entry: './lib/index.ts',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      type: 'commonjs2',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            getCustomTransformers: (program) => {
              const transformer = tsTransformPaths(program);

              return {
                before: [transformer.before],
                afterDeclarations: [transformer.afterDeclarations],
              };
            },
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
    alias: {
      lib: path.resolve(__dirname, 'lib'),
    },
  },
  externals: {
    '@fancywork/core': '@fancywork/core',
  },
};
