import express from 'express';
import { addTransaction } from '../controllers/transactionControllers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

//Define the routes paths and its controllers
router.post('/add', protect, addTransaction);

export default router;
