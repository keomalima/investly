import express from 'express';
import {
  registerNewUser,
  authUser,
  logoutUser,
  updateUserById,
} from '../controllers/userControllers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

//Define the route paths and its controllers
router.post('/', registerNewUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.put('/', protect, updateUserById);

export default router;
