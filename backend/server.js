import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { testDbConnection } from './config/db.js';
import { createProxyMiddleware } from 'http-proxy-middleware';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import { sequelize } from './config/db.js';

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

    app.use(
      cors({
        origin: 'https://investly-ten.vercel.app', // Your Vercel deployment domain
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
        credentials: true, // Allow cookies if needed
      })
    );

    app.use(
      '/fmp-api',
      (req, res, next) => {
        console.log('Proxying request:', req.method, req.url);
        next();
      },
      createProxyMiddleware({
        target: 'https://financialmodelingprep.com',
        changeOrigin: true,
        pathRewrite: {
          '^/fmp-api': '/api/v3', // Rewrite path to match the API endpoint
        },
      })
    );

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
