const CracoAlias = require('craco-alias');
const WorkerPlugin = require('worker-plugin');

module.exports = {
  webpack: {
    plugins: [new WorkerPlugin()],
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: './src',
        tsConfigPath: './tsconfig.path.json',
      },
    },
  ],
};
