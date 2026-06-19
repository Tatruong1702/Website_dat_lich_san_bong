import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import fieldRoutes from './routes/fieldRoutes.js';
import courtsRoutes from './routes/courts.js';
import paymentsRoutes from './routes/payments.js';


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/fields', fieldRoutes);
app.use("/api/courts", courtsRoutes);
app.use("/api/payments", paymentsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend chạy ở http://localhost:${PORT}`);
});