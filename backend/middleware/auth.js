import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

const protect = async (req, res, next) => {
  let token;

  // Get token from the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from the Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user data to the request object
      req.user = await User.findByPk(decoded.userId);

      if (!req.user) {
        return res.status(404).json({ error: 'User not found' });
      }

      next(); // Proceed to the route handler
    } catch (error) {
      res.status(403).json({ error: 'Not authorized, invalid token' });
    }
  } else {
    res.status(403).json({ error: 'Not authorized, token missing' });
  }
};

export { protect };
