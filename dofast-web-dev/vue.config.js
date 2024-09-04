'use strict';

const path = require('path');
const defaultSettings = require('./src/settings.js');
const UnoCSS = require('@unocss/webpack').default;

function resolve(dir) {
  return path.join(__dirname, dir);
}

const CompressionPlugin = require('compression-webpack-plugin');

const name = process.env.VUE_APP_TITLE || '澳美MES系统'; // 网页标题

const isdev = process.env.NODE_ENV == 'development';

const port = process.env.VITE_PORT || 8888; // 端口

// vue.config.js 配置说明
//官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
  publicPath: process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH : '/',
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: 'dist',
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: 'static',
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: isdev,
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // webpack-dev-server 相关配置
  devServer: {
    host: '0.0.0.0',
    public: "127.0.0.1:8080",
    port: port,
    open: false,
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      ['/proxy-api']: {
        target: process.env.VITE_BASE_URL,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: '',
        },
      },
      ['/mock-api']: {
        target: process.env.VITE_BASE_URL,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: '',
        },
      },
      ['/admin-api']: {
        target: process.env.VITE_BASE_URL,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: '',
        },
      },
      ['/jmreport']: {
        target: process.env.VITE_BASE_URL,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: '',
        },
      },
    },
    disableHostCheck: true,
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|webp)(\?.*)?$/i,
          exclude: /node_modules/,
          include: path.resolve('src'),
          use: [
            // {
            //   loader: 'url-loader',
            //   options: {
            //     esModule: false, // 不转换esm规范
            //     name: 'img/[name].[hash:2].[ext]',
            //     limit: 1024 * 12
            //   }
            // },
            {
              loader: 'cache-loader',
            },
          ],
        },
        {
          test: /\.ya?ml$/,
          use: 'yaml-loader',
        },
      ],
    },
    plugins: isdev
      ? [UnoCSS({ injectReset: true })]
      : [
        UnoCSS(),
        // http://doc.ruoyi.vip/ruoyi-vue/other/faq.html#使用gzip解压缩静态文件
        new CompressionPlugin({
          cache: isdev, // 不启用文件缓存
          test: /\.(js|css|html)?$/i, // 压缩文件格式
          // test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
          deleteOriginalAssets: false,
          threshold: 1024 * 10, // 对10K以上的数据进行压缩
          filename: '[path].gz[query]', // 压缩后的文件名
          algorithm: 'gzip', // 使用gzip压缩
          minRatio: 0.8, // 压缩率小于1才会压缩
        }),
      ],
  },
  chainWebpack(config) {
    config.plugins.delete('preload'); // TODO: need test
    config.plugins.delete('prefetch'); // TODO: need test

    config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end();
    config.module.rule('vue').uses.delete('cache-loader');

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end();

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end();
      const cacheGroups = {
        libs: {
          name: 'chunk',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial', // only package third parties that are initially dependent
        },
        codemirror: {
          name: 'chunk-codemirror', // split elementUI into a single package
          priority: 12, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          test: /[\\/]node_modules[\\/](vue-)?_?codemirror(.*)/, // in order to adapt to cnpm
        },
        dhtmlx: {
          name: 'chunk-dhtmlx', // split elementUI into a single package
          priority: 13, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          test: /[\\/]node_modules[\\/]\@?dhtmlx(.*)/, // in order to adapt to cnpm
        },
        elementUI: {
          name: 'chunk-elementUI', // split elementUI into a single package
          priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
        },
        bpmn: {
          name: 'chunk-bpmn', // split elementUI into a single package
          priority: 30, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          test: /[\\/]node_modules[\\/]_?bpmn-js(.*)/, // in order to adapt to cnpm
        },
        lodash: {
          name: 'chunk-lodash',
          test: /[\\/]node_modules[\\/]lodash(.*)/,
          priority: 40,
          chunks: 'initial', // only package third parties that are initially dependent
        },
        commons: {
          name: 'chunk-commons',
          test: resolve('src/components'), // can customize your rules
          minChunks: 3, //  minimum common number
          priority: 5,
          reuseExistingChunk: true,
        },
      };
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups,
      });
      config.optimization.runtimeChunk('single', {
        from: path.resolve(__dirname, './public/robots.txt'), //防爬虫文件
        to: './', //到根目录下
      });
    });
    config.merge({
      cache: false,
    });
  },
  css: {
    extract: true,
    loaderOptions: {
      sass: {
        sassOptions: { outputStyle: 'expanded' },
      },
    },
  },
};
