import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import inventoryRoutes from './src/routes/inventoryRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import reviewRoutes from './src/routes/reviewRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';

const app = express();

app.use(
  cors({
    origin: [
      'https://se-proj-self.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API running'
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;

  res.status(status).json({
    success: false,
    data: null,
    message: err.message || 'Internal server error'
  });
});

export default app;
