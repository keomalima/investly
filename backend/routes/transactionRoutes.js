import express from 'express';
import {
  addNewTransaction,
  deleteTransactionById,
  getAllTransactions,
  updateTransactionById,
} from '../controllers/transactionControllers.js';
import apicache from 'apicache';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Clears the cache whenever a user adds or updates a transaction
let cache = apicache.middleware;

//Define the route paths and its controllers
router
  .route('/:id')
  .put(protect, updateTransactionById)
  .delete(protect, deleteTransactionById);
router
  .route('/')
  .get(protect, cache('1 day'), getAllTransactions)
  .post(protect, addNewTransaction);

export default router;
