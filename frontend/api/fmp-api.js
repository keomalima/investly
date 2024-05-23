import { createProxyMiddleware } from 'http-proxy-middleware';

export default createProxyMiddleware({
  target: 'https://financialmodelingprep.com/api',
  changeOrigin: true,
  pathRewrite: { '^/fmp-api': '' },
});
