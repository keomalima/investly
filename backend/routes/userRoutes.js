import express from 'express';
import {
  registerNewUser,
  authUser,
  authDemoUser,
  logoutUser,
  updateUserById,
} from '../controllers/userControllers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

//Define the route paths and its controllers
router.post('/', registerNewUser);
router.post('/auth', authUser);
router.post('/demo', authDemoUser);
router.post('/logout', logoutUser);
router.put('/', protect, updateUserById);

export default router;
