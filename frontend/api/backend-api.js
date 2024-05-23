import { createProxyMiddleware } from 'http-proxy-middleware';

export default createProxyMiddleware({
  target: 'https://investly.onrender.com/',
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
});
