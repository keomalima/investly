import { createProxyMiddleware } from 'http-proxy-middleware';

const backendApiProxy = createProxyMiddleware({
  target: 'https://investly.onrender.com/',
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
});

export default function handler(req, res) {
  return backendApiProxy(req, res);
}
