const fs = require('fs');

module.exports = {
  lintOnSave: false,
  assetsDir: "public",
  publicPath: "",
  productionSourceMap: false,
  devServer: {
    https: true,
    key: fs.readFileSync("./certificate/cert/server.key"),
    cert: fs.readFileSync("./certificate/cert/server.crt"),
  },
};
