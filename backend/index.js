import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/banners', bannerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend chạy ở http://localhost:${PORT}`);
});