const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
  app.use(
    createProxyMiddleware('/naver', {
      target: 'https://m.search.naver.com',
      pathRewrite: {
        '^/naver':''
      },
      changeOrigin: true
    })
  )
  
  app.use(
    createProxyMiddleware('/google', {
      target: 'https://google.com',
      pathRewrite: {
        '^/google':''
      },
      changeOrigin: true
    })
  )

};