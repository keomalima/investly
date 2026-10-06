import { test } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
// Models are imported only after a valid dummy URI is set; no database connection is made.
process.env.POSTGRESQL_DB_URI = 'postgresql://test:test@localhost/demo-tests';
const { createDemoSeeder, DEMO_EMAIL } = await import('../utils/demoPortfolio.js');
const { authDemoUser, registerNewUser, updateUserById } = await import('../controllers/userControllers.js');
const { default: User } = await import('../models/userModel.js');

function seedFixture() {
  const users = [], stocks = [], trades = [];
  const matches = (row, where) => Object.entries(where).every(([key, value]) => String(row[key]) === String(value));
  function model(rows) {
    return { findOrCreate: async ({ where, defaults }) => {
      const found = rows.find((row) => matches(row, where));
      if (found) return [found, false];
      const row = { id: rows.length + 1, ...defaults, ...where, reload: async () => {} };
      rows.push(row);
      return [row, true];
    } };
  }
  const seed = createDemoSeeder({
    sequelize: { transaction: async (callback) => callback({ LOCK: { UPDATE: 'UPDATE' } }) },
    User: model(users), Stock: model(stocks), Transaction: model(trades),
    hashPassword: async () => 'hashed-random-password',
  });
  return { seed, users, stocks, trades };
}

test('demo seeding creates four stocks and six trades and preserves edits on restart', async () => {
  const { seed, users, stocks, trades } = seedFixture();
  await seed();
  assert.equal(users.length, 1);
  assert.equal(users[0].email, DEMO_EMAIL);
  assert.equal(users[0].password, 'hashed-random-password');
  assert.deepEqual(stocks.map((stock) => stock.ticker), ['AAPL', 'MSFT', 'NVDA', 'DIS']);
  assert.equal(trades.length, 6);
  assert.equal(trades.filter((trade) => trade.type === 'sell').length, 1);
  trades[0].shares = 20;
  trades.push({ id: 99, user_id: 1, stock_id: 1, date: new Date('2026-10-01'), type: 'buy', shares: 3 });
  await seed();
  assert.equal(users.length, 1);
  assert.equal(stocks.length, 4);
  assert.equal(trades.length, 7);
  assert.equal(trades[0].shares, 20);
  assert.equal(trades[6].id, 99);
});

test('demo seeding restores only missing sample trades', async () => {
  const { seed, trades } = seedFixture();
  await seed();
  trades.splice(2, 1);
  await seed();
  assert.equal(trades.length, 6);
});

function response() {
  return { statusCode: 200, payload: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
}

test('demo login returns a usable JWT without exposing credentials and respects availability', async () => {
  const originalFindOne = User.findOne;
  const originalEnabled = process.env.DEMO_ENABLED;
  const originalSecret = process.env.JWT_SECRET;
  try {
    process.env.DEMO_ENABLED = 'true';
    process.env.JWT_SECRET = 'demo-test-secret';
    User.findOne = async () => ({ id: 42, email: DEMO_EMAIL, username: 'Demo Investor', password: 'private-hash' });
    const success = response();
    await authDemoUser({}, success);
    assert.equal(success.statusCode, 200);
    assert.equal(success.payload.isDemo, true);
    assert.equal(jwt.verify(success.payload.token, 'demo-test-secret').userId, 42);
    assert.ok(!JSON.stringify(success.payload).includes('private-hash'));
    User.findOne = async () => null;
    const missing = response();
    await authDemoUser({}, missing);
    assert.equal(missing.statusCode, 503);
    process.env.DEMO_ENABLED = 'false';
    User.findOne = async () => assert.fail('Disabled demo must not read the database');
    const disabled = response();
    await authDemoUser({}, disabled);
    assert.equal(disabled.statusCode, 503);
  } finally {
    User.findOne = originalFindOne;
    if (originalEnabled === undefined) delete process.env.DEMO_ENABLED; else process.env.DEMO_ENABLED = originalEnabled;
    if (originalSecret === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = originalSecret;
  }
});

test('visitors cannot claim or change the shared demo identity', async () => {
  const registration = response();
  await registerNewUser({ body: { email: DEMO_EMAIL, username: 'Other', password: 'test-password' } }, registration);
  assert.equal(registration.statusCode, 409);
  const update = response();
  await updateUserById({ user: { id: 42, email: DEMO_EMAIL }, body: { password: 'changed' } }, update);
  assert.equal(update.statusCode, 409);
});
