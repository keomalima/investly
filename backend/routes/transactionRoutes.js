import express from 'express';
import {
  addTransaction,
  getPortolio,
  getTransactions,
  testMethod,
} from '../controllers/transactionControllers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

//Define the routes paths and its controllers
router.get('/', protect, getTransactions);
router.post('/test', protect, testMethod);
router.get('/portfolio', protect, getPortolio);
router.post('/add', protect, addTransaction);

export default router;
