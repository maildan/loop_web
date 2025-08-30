const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  style: {
    postcss: {
      mode: 'extends',
      loaderOptions: {
        postcssOptions: {
          config: path.resolve(__dirname, 'postcss.config.js'),
        },
      },
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
    plugins: {
      add: process.env.ANALYZE === 'true' ? [
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      ] : [],
    },
    configure: (webpackConfig, { env, paths }) => {
      // 프로덕션 빌드 최적화
      if (env === 'production') {
        // Tree shaking 강화
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          usedExports: true,
          sideEffects: false,
          // 코드 분할 최적화
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                priority: 10,
              },
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                name: 'react',
                chunks: 'all',
                priority: 20,
              },
              recharts: {
                test: /[\\/]node_modules[\\/]recharts[\\/]/,
                name: 'recharts',
                chunks: 'all',
                priority: 15,
              },
              lucide: {
                test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
                name: 'lucide',
                chunks: 'all',
                priority: 15,
              },
            },
          },
        };

        // 이미지 최적화
        webpackConfig.module.rules.push({
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024, // 8kb 미만 이미지는 인라인
            },
          },
          generator: {
            filename: 'static/media/[name].[hash:8][ext]',
          },
        });
      }

      // 개발 환경에서 Hot Module Replacement 최적화
      if (env === 'development') {
        webpackConfig.cache = {
          type: 'filesystem',
          buildDependencies: {
            config: [__filename],
          },
        };
      }

      return webpackConfig;
    },
  },
  devServer: {
    // 개발 서버 최적화
    compress: true,
    hot: true,
    // 모든 IP에서 접근 가능하도록 설정
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: 'all',
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3500',
        changeOrigin: true,
      },
    },
  },
};
