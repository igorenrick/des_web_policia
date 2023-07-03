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
    port: 8080,
  },
  pwa: {
    name: 'Batalhão Chat',
    themeColor: '#3E4095',
    msTileColor: '#FFFFFF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default',
    workboxPluginMode: 'GenerateSW',
    iconPaths: {
      faviconSVG: 'img/icons/favicon.svg',
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png'
    }
  }
})
