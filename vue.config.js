
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  baseUrl: '/',
  outputDir: 'dist',
  devServer: {
    port: 8080,
    https: false,
    hotOnly: true,
    disableHostCheck: true,
    open: true,
    before: app => {}
  },
  configureWebpack: {
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log']
            }
          }
        })
      ]
    }
  }
}
