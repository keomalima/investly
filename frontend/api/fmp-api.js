import { createProxyMiddleware } from 'http-proxy-middleware';

const fmpApiProxy = createProxyMiddleware({
  target: 'https://financialmodelingprep.com/api',
  changeOrigin: true,
  pathRewrite: { '^/fmp-api': '' },
});

export default function handler(req, res) {
  return fmpApiProxy(req, res);
}
