const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
    pathinfo: false,
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  plugins: [new MiniCssExtractPlugin({ filename: 'main.css' })],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: { declarationMap: false },
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
      {
        test: /\.((c|sa|sc)ss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[folder]_[local]__[hash:base64:5]',
                exportLocalsConvention: 'camelCaseOnly',
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      lib: path.resolve(__dirname, 'lib'),
    },
  },
  externals: {
    'react-dom': 'react-dom',
    react: 'react',
    antd: 'antd',
  },
};
