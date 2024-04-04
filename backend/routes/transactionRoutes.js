import express from 'express';
import {
  addNewTransaction,
  deleteTransactionById,
  getAllTransactions,
  updateTransactionById,
} from '../controllers/transactionControllers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

//Define the route paths and its controllers
router
  .route('/:id')
  .put(protect, updateTransactionById)
  .delete(protect, deleteTransactionById);
router
  .route('/')
  .get(protect, getAllTransactions)
  .post(protect, addNewTransaction);

export default router;
