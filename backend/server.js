import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
dotenv.config();
import { testDbConnection } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
const port = process.env.PORT || 5000;

// Tests the conection with the postgresSQL database
testDbConnection();

const app = express();

// Middleware responsible for parsing the data obtained from the request body
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//
app.use(cookieParser());

// Sets my API routes to this path
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => res.send('API running'));

app.listen(port, () => {
  console.log('Listening');
});
