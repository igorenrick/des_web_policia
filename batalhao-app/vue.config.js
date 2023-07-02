const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        fs: false,
        path: false,
        os: false
      }
    }
  },
  devServer: {
    port: 8081,
  },
})