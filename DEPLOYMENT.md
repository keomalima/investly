# Redeploy Investly on Render

The recommended setup serves the React build and Express API from one free Render web service. PostgreSQL remains a separate database. Existing Vercel hosting is optional.

## 1. Check the old database first

In Render, inspect the existing PostgreSQL service and its status. Do not delete it or reset its tables. If it is still usable, keep its data and use its current connection URL. The password previously committed in `backend/config/config.json` must be rotated if that database still exists. Removing it from the latest code does not remove it from Git history.

Free Render Postgres expires after 30 days, followed by a 14-day upgrade grace period, then deletion. A new free database only postpones the same issue. For a lasting portfolio, use an external hosted Postgres database or a paid Render database. If the old database has already been deleted and there is no backup, this app cannot recover the old users or transactions.

## 2. Configure the web service

Deploy the `fix/render-redeployment` branch for testing, or merge its PR and deploy `main`.

| Render setting | Value |
| --- | --- |
| Repository | `keomalima/investly` |
| Runtime | Node |
| Root Directory | Empty (repository root) |
| Build Command | `npm ci --prefix backend && npm ci --prefix frontend && npm run build --prefix frontend` |
| Start Command | `npm start --prefix backend` |
| Health Check Path | `/health` |
| Instance | Free |

The `render.yaml` blueprint contains equivalent settings. Use it for a new service; editing an existing service manually avoids creating a duplicate.

## 3. Set environment variables

| Variable | Where to get the value |
| --- | --- |
| `NODE_ENV` | `production` |
| `NODE_VERSION` | `22` |
| `POSTGRESQL_DB_URI` | Current database connection URL; for Render Postgres use its internal URL in the same region |
| `JWT_SECRET` | A new random secret, e.g. `openssl rand -hex 32` on your computer |
| `FINANCIAL_API_KEY` | Your FMP dashboard API key |

`DATABASE_URL` is also accepted instead of `POSTGRESQL_DB_URI`. Set only the intended database URL. Never commit real credentials or paste them into a PR, issue, or chat.

For a single Render service, remove the old `VITE_API_BASE_URL`, `VITE_API_STOCK_BASE_URL`, and `VITE_FINANCIAL_API_KEY` values from the service. Browser requests now use `/api` on the current origin. Only `FINANCIAL_API_KEY` on the server is needed for stock data.

Optional: if you keep Vercel, set `VITE_API_BASE_URL` there to the Render backend origin (no `/api` suffix), and set `FRONTEND_URL` on Render to the exact frontend origin. Rebuild the frontend after changing any `VITE_*` value.

## 4. Deploy and check

1. Trigger a deploy of the selected branch.
2. In logs, expect `Server is running on port ...`. Missing environment variables and database connection failures stop startup.
3. Open `https://YOUR-SERVICE.onrender.com/health`; expect `{"status":"ok"}`.
4. Open the service root, register a test account, and log in. New tables are created automatically with `sequelize.sync()`; existing tables are not dropped.
5. Search `AAPL`, open its stock page, and check the 5-day, 1-month and 6-month charts.
6. Add a test transaction, reload, and check that portfolio totals and the transaction persist.
7. Open a stock page directly in a new tab to confirm SPA routing works.
8. Add your custom domain only after the Render URL works. If moving `investly.keomalima.com` from Vercel, update DNS using the exact values Render provides.

FMP profile and chart endpoints now use `/stable/`. Actual access depends on your API key and plan. A valid key can still be denied access to intraday charts. Check the endpoints in your FMP dashboard before buying any plan. The application reports provider access and quota errors without exposing your key.

The Demo User button needs `VITE_DEMO_USER_EMAIL` and `VITE_DEMO_USER_PASSWORD` set at build time, plus a matching account in the new/current database. Create a dedicated disposable demo account through Register, then rebuild with those optional values. Its password is public in the frontend bundle. Optional EmailJS notifications are skipped when their configuration is absent.

## Local validation

```bash
npm ci --prefix backend
npm ci --prefix frontend
npm test --prefix backend
npm run build --prefix frontend
```

To start locally, configure `backend/.env` from its example and run `npm start` inside `backend`. For frontend development run `npm run dev --prefix frontend` from the repository root; Vite proxies `/api` to `http://localhost:5000`.

References: [Render free services](https://render.com/docs/free), [Render Node deployment](https://render.com/docs/deploy-node-express-app), [FMP API documentation](https://site.financialmodelingprep.com/developer/docs).
