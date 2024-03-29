import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
} from '../controllers/userControllers.js';

const router = express.Router();

//Define the routes paths and its controllers
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;
