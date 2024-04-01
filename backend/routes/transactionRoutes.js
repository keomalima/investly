import express from 'express';
import {
  addTransaction,
  getPortolio,
  getTransactions,
} from '../controllers/transactionControllers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

//Define the routes paths and its controllers
router.get('/', protect, getTransactions);
router.get('/portfolio', protect, getPortolio);
router.post('/add', protect, addTransaction);

export default router;
