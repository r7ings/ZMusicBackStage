const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  //解决npm run build后引入资源路径错误
  publicPath: "./"
})
// module.exports = {
//   devServer: {
//     port: 8080,
//     proxy: {
//       '/apis': {
//         target: 'http://43.138.114.35:8888',  //要解决跨域的接口的域名
//         secure: false,           //如果是https接口，需要配置这个参数
//         changeOrigin: true,  // 如果接口跨域，需要进行这个参数配置
//         pathRewrite: {
//           '^/apis': ''  // 路径重写
//         }
//       },
//     }
//   },
//   lintOnSave: false,
//   transpileDependencies: true
// }

