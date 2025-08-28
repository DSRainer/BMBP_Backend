import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import cors from 'cors';
import { Pool } from 'pg';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import packageRoutes from './routes/packages';
import orderRoutes from './routes/orders';
import contactRoutes from './routes/contact';

const app: Express = express();
const port = process.env.PORT || 3001;

// Database Connection
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/packages', packageRoutes);
app.use('/orders', orderRoutes);
app.use('/contact', contactRoutes);

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('BMBP Backend is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack,
  });
});
