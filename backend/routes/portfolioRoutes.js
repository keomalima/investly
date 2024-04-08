import express from 'express';
import { getPortfolio } from '../controllers/portfolioControllers.js';
import apicache from 'apicache';
import { protect } from '../middleware/auth.js';

const router = express.Router();
// Sets the cache middleware to be used
let cache = apicache.middleware;

//Define the route paths and its controllers
router.get('/', protect, cache('1 day'), getPortfolio);

export default router;
