const project = require("./package.json")
module.exports = {
  css: {
    sourceMap: true
  }
}
process.env.VUE_APP_VERSION = project.version
