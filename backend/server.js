import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { testDbConnection } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';

const port = process.env.PORT || 5000;

// Tests the conection with the postgresSQL database
testDbConnection();

const app = express();

// Middleware responsible for parsing the data obtained from the request body
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

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
  console.log('Listening');
});
