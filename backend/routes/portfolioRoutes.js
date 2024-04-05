import express from 'express';
import {
  getPortfolio,
  testRoute,
} from '../controllers/portfolioControllers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

//Define the route paths and its controllers
router.get('/', protect, getPortfolio);
router.get('/test', protect, testRoute);

export default router;
