const project = require("./package.json")
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')


module.exports = {
  css: {
    sourceMap: true
  },
  configureWebpack: (config) => {
    config.resolve.plugins.push(new TsconfigPathsPlugin())
  },
}

process.env.VUE_APP_VERSION = project.version
