module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  devServer: {
    port: 8080,
    https: false,
    hotOnly: true,
    disableHostCheck: true,
    open: true,
    before: app => {}
  },
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],
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
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV !== 'development') {
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
    }
  }
}
