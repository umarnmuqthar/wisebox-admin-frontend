const { createProxyMiddleware } = require('http-proxy-middleware');
const BASE_URL = process.env.REACT_APP_API_URL;
const PROXY_URL = process.env.REACT_APP_PROXY_URL;

module.exports = function(app) {
  app.use(
    PROXY_URL,
    createProxyMiddleware({
      target: BASE_URL,
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        [`^/${PROXY_URL}`]: '/'
      }
    })
  );
};