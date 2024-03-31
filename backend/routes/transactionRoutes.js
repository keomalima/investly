import express from 'express';
import {
  addTransaction,
  getTransactions,
} from '../controllers/transactionControllers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

//Define the routes paths and its controllers
router.get('/:id', protect, getTransactions);
router.post('/add', protect, addTransaction);

export default router;
