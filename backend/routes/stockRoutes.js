import express from 'express';
import { protect } from '../middleware/auth.js';
import { getStockData, getStockHistory } from '../utils/apiCall.js';

const router = express.Router();
router.use(protect);

router.get('/profile', async (req, res) => {
  if (typeof req.query.symbol !== 'string' || !req.query.symbol.trim()) {
    return res.status(400).json({ error: 'A stock symbol is required' });
  }
  try {
    res.json(await getStockData(req.query.symbol));
  } catch (error) {
    res.status(error.status || 502).json({ error: error.message });
  }
});

router.get('/history', async (req, res) => {
  const { symbol, from, to, interval } = req.query;
  if (typeof symbol !== 'string' || !symbol.trim()) {
    return res.status(400).json({ error: 'A stock symbol is required' });
  }
  try {
    res.json(await getStockHistory(symbol, from, to, interval));
  } catch (error) {
    res.status(error.status || 502).json({ error: error.message });
  }
});

export default router;
