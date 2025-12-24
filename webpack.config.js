const path = require('path');
const devcert = require('devcert');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = async (env, { mode }) => {
  const isDevelopment = mode === 'development';
  const { key, cert } = await devcert.certificateFor('localhost');

  return {
    mode: mode,
    entry: {
      main: './src/main.tsx',
    },
    output: {
      filename: (pathData) => {
        // 정확히 'main'인 경우만 main.js
        return pathData.chunk.name === 'main' ? 'main.js' : '[name].js';
      },
      chunkFilename: (pathData) => {
        // 청크 이름이 있으면 그대로 사용 (main-6543 → main-6543.js)
        const chunkName = pathData?.chunk?.name;
        const chunkId = pathData?.chunk?.id;

        // 이미 main-으로 시작하는 경우 그대로 사용
        if (
          chunkName &&
          typeof chunkName === 'string' &&
          chunkName.startsWith('main-')
        ) {
          return `${chunkName}.js`;
        }

        // vendors 같은 경우 main-vendors로 변경
        if (
          chunkName &&
          typeof chunkName === 'string' &&
          chunkName !== 'main'
        ) {
          return `main-${chunkName}.js`;
        }

        // ID를 사용하여 main-[id].js 형식으로
        const id = chunkId != null ? String(chunkId) : 'chunk';
        return `main-${id}.js`;
      },
      path: path.resolve(
        `./dist/components@${process.env.npm_package_version}`
      ),
      publicPath: `./components@${process.env.npm_package_version}/`,
    },
    module: {
      rules: [
        mode === 'development'
          ? {
              test: /\.(ts|tsx)$/,
              exclude: /node_modules/,
              use: { loader: 'babel-loader' },
            }
          : {},
        {
          enforce: 'pre',
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            fix: true,
          },
        },
        {
          test: /\.(ts|tsx)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.svg/,
          type: 'asset/inline',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', 'json'],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      https: {
        key,
        cert,
      },
      port: 9100,
      proxy: [
        {
          context: ['jp/api/commerce/v5/ja'],
          target: 'https://www.uni.com',
          secure: true,
          changeOrigin: true,
        },
      ],
    },
    devtool: isDevelopment ? 'source-map' : false,
    optimization: {
      runtimeChunk: false, // 런타임을 main.js에 포함 (자동 로드 위해 필요)
      splitChunks: {
        chunks: 'all',
        maxSize: 60 * 1024, // 60KB
        minSize: 0,
        cacheGroups: {
          default: false, // default 비활성화하여 충돌 방지
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            reuseExistingChunk: true,
            // name을 지정하지 않으면 chunkFilename이 처리
          },
        },
      },
      minimizer: isDevelopment
        ? []
        : [
            new TerserPlugin({
              parallel: true,
              terserOptions: {
                toplevel: true,
                compress: {
                  pure_funcs: ['console.debug', 'console.log'],
                },
              },
            }),
          ],
    },
    plugins: [],
  };
};
