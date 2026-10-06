import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import { sequelize } from './config/db.js';
import stockRoutes from './routes/stockRoutes.js';
import { demoEnabled, seedDemoPortfolio } from './utils/demoPortfolio.js';

const port = process.env.PORT || 5000;
const frontendDist = fileURLToPath(new URL('../frontend/dist/', import.meta.url));
const allowedOrigins = (process.env.FRONTEND_URL || 'https://investly.keomalima.com')
  .split(',').map((origin) => origin.trim());

// Ensure database connection and sync models
async function initializeServer() {
  try {
    for (const name of ['JWT_SECRET', 'FINANCIAL_API_KEY']) {
      if (!process.env[name]) throw new Error(`Missing required environment variable: ${name}`);
    }
    if (!process.env.POSTGRESQL_DB_URI && !process.env.DATABASE_URL &&
        !['PG_USER', 'PG_PASSWORD', 'PG_HOST', 'PG_PORT', 'PG_DATABASE'].every((name) => process.env[name])) {
      throw new Error('Set POSTGRESQL_DB_URI or DATABASE_URL before starting the server');
    }
    await sequelize.authenticate();
    await sequelize.sync(); // This creates the tables in the database if they don't exist
    if (demoEnabled()) {
      await seedDemoPortfolio();
      console.log('Demo portfolio is ready.');
    }

    const app = express();

    // Middleware responsible for parsing the data obtained from the request body
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(
      cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
        credentials: true, // Allow cookies if needed
      })
    );

    // Sets the API route paths
    app.use('/api/users', userRoutes);
    app.use('/api/transactions', transactionRoutes);
    app.use('/api/portfolio', portfolioRoutes);
    app.use('/api/stocks', stockRoutes);
    app.get('/health', async (req, res) => {
      try {
        await sequelize.authenticate();
        res.json({ status: 'ok' });
      } catch {
        res.status(503).json({ status: 'unavailable' });
      }
    });
    app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found' }));

    if (process.env.NODE_ENV === 'production') {
      // Serve static files from the frontend/dist directory
      app.use(express.static(frontendDist));

      // Handle all GET requests by sending back the index.html file
      app.get('*', (req, res) =>
        res.sendFile(path.join(frontendDist, 'index.html'))
      );
    } else {
      app.get('/', (req, res) => res.send('API running'));
    }

    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to initialize the server:', error.message);
    process.exit(1); // Exit the process if unable to initialize the server
  }
}

// Test database connection and start the server
initializeServer();
