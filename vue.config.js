const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')
const webpack = require('webpack')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css']
let publicPath = process.env.NODE_ENV === 'production' ? '/' : '/'
let dllPublishPath = '/vendor'

module.exports = {
  publicPath: publicPath,
  outputDir: 'dist',
  devServer: {
    port: 8086,
    https: false,
    hotOnly: true,
    disableHostCheck: true,
    open: true,
    before: app => {}
  },
  transpileDependencies: ['vue-echarts', 'resize-detector'],
  productionSourceMap: false,
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      const argv = process.argv
      if (argv.indexOf('--build-mode') > -1) {
        const env = argv[argv.indexOf('--build-mode') + 1]
        args[0]['process.env']['NODE_ENV'] = `"${env}"`
      }
      return args
    })
    // 修复HMR
    config.resolve.symlinks(true)
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV !== 'development') {
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = [
        'console.log'
      ]
      console.log('config', config)
      // 为生产环境修改配置...
      config.plugins.push(
        new webpack.DllReferencePlugin({
          context: process.cwd(),
          manifest: require('./public/vendor/vendor-manifest.json')
        }),
        // 将 dll 注入到 生成的 html 模板中
        new AddAssetHtmlPlugin({
          // dll文件位置
          filepath: path.resolve(__dirname, './public/vendor/*.js'),
          // dll 引用路径
          publicPath: dllPublishPath,
          // dll最终输出的目录
          outputPath: './vendor'
        }),
        // 开启压缩
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      )
      if (process.env.npm_lifecycle_event === 'analyze') {
        config.plugins.push(new BundleAnalyzerPlugin())
      }
    }
  }
}
