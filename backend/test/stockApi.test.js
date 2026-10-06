import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStockClient } from '../utils/apiCall.js';

process.env.FINANCIAL_API_KEY = 'test-key';

test('portfolio profiles use individual stable requests and preserve UI fields', async () => {
  const calls = [];
  const api = createStockClient({ get: async (endpoint, options) => {
    calls.push({ endpoint, options });
    return { data: [{ symbol: options.params.symbol, change: 0, exchange: 'NASDAQ', price: 200 }] };
  } });
  const profiles = await api.getStockData(['aapl', 'MSFT', 'AAPL']);
  assert.deepEqual(calls.map((call) => [call.endpoint, call.options.params.symbol]),
    [['profile', 'AAPL'], ['profile', 'MSFT']]);
  assert.equal(calls[0].options.params.apikey, 'test-key');
  assert.equal(profiles[0].changes, 0);
  assert.equal(profiles[0].exchangeShortName, 'NASDAQ');
  assert.deepEqual(await api.getStockData([]), []);
  assert.equal(calls.length, 2);
});

test('chart requests use stable interval path and query parameters', async () => {
  let call;
  const candles = [{ date: '2026-10-01 12:00:00', open: 200, close: 202 }];
  const api = createStockClient({ get: async (...args) => { call = args; return { data: candles }; } });
  assert.deepEqual(await api.getStockHistory('aapl', '2026-10-01', '2026-10-05', '4hour'), candles);
  assert.equal(call[0], 'historical-chart/4hour');
  assert.deepEqual(call[1].params, { symbol: 'AAPL', from: '2026-10-01', to: '2026-10-05', apikey: 'test-key' });
});

test('invalid symbols, intervals and date ranges do not contact FMP', async () => {
  const api = createStockClient({ get: async () => { assert.fail('Unexpected upstream request'); } });
  await assert.rejects(api.getStockData('../../secret'), { status: 400 });
  await assert.rejects(api.getStockHistory('AAPL,MSFT', '2026-10-01', '2026-10-05', '4hour'), { status: 400 });
  await assert.rejects(api.getStockHistory('AAPL', '2026-10-01', '2026-10-05', 'daily'), { status: 400 });
  await assert.rejects(api.getStockHistory('AAPL', '2026-02-30', '2026-10-05', '30min'), { status: 400 });
  await assert.rejects(api.getStockHistory('AAPL', '2026-10-05', '2026-10-01', '30min'), { status: 400 });
});

test('provider errors report access and quota failures without leaking the key', async () => {
  for (const status of [401, 403, 429, 500]) {
    const api = createStockClient({ get: async () => { throw { message: 'URL contains test-key', response: { status } }; } });
    await assert.rejects(api.getStockData('AAPL'), (error) => {
      assert.equal(error.status, 502);
      assert.ok(!error.message.includes('test-key'));
      if (status === 403) assert.match(error.message, /endpoint permissions/);
      if (status === 429) assert.match(error.message, /limit/);
      return true;
    });
  }
});

test('provider error objects are not treated as profile arrays', async () => {
  const api = createStockClient({ get: async () => ({ data: { 'Error Message': 'Invalid key test-key' } }) });
  await assert.rejects(api.getStockData('AAPL'), { status: 502 });
});
