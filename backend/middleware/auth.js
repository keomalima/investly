import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

const protect = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  // Check for JWT in headers
  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user data to the request object
      req.user = await User.findByPk(decoded.userId);
      next(); // Proceed to the route handler
    } catch (error) {
      res.status(403).json({ error: 'Not authorized, invalid token' });
    }
  } else {
    res.status(403).json({ error: 'Not authorized, token missing' });
  }
};

export { protect };
