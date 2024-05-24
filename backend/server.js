import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { testDbConnection } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import { sequelize } from './config/db.js';
import { createProxyMiddleware } from 'http-proxy-middleware';

const port = process.env.PORT || 5000;

// Ensure database connection and sync models
async function initializeServer() {
  try {
    await sequelize.sync(); // This creates the tables in the database if they don't exist

    const app = express();

    // Middleware responsible for parsing the data obtained from the request body
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    // CORS configuration
    const corsOptions = {
      origin: 'https://investly-ten.vercel.app', // Your Vercel deployment domain
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'pragma',
        'auth-token',
        'stripe-signature',
        'APPS',
        'publicauthkey',
        'privateauthkey',
      ],
      credentials: true, // Allow credentials
    };

    // Apply CORS middleware
    app.use(cors(corsOptions));

    // Enable preflight across-the-board
    app.options('*', (req, res) => {
      res.header(
        'Access-Control-Allow-Origin',
        'https://investly-ten.vercel.app'
      ); // Use the same origin as in corsOptions
      res.header(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
      );
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Requested-With, pragma, auth-token, stripe-signature, APPS, publicauthkey, privateauthkey'
      );
      res.header('Access-Control-Allow-Credentials', 'true');
      res.sendStatus(204); // No Content
    });

    // Sets the API route paths
    app.use('/api/users', userRoutes);
    app.use('/api/transactions', transactionRoutes);
    app.use('/api/portfolio', portfolioRoutes);

    if (process.env.NODE_ENV === 'production') {
      const __dirname = path.resolve();

      // Serve static files from the frontend/dist directory
      app.use(express.static(path.join(__dirname, 'frontend/dist')));

      // Handle all GET requests by sending back the index.html file
      app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
      );
    } else {
      app.get('/', (req, res) => res.send('API running'));
    }

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to initialize the server:', error);
    process.exit(1); // Exit the process if unable to initialize the server
  }
}

// Test database connection and start the server
testDbConnection();
initializeServer();
