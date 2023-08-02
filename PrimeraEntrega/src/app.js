import express from 'express';
import productsRouter from './routes/products.router.js';
import cartRoutes from './routes/carts.router.js';

const app = express();

app.use(express.json());
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRoutes);

app.listen(8080, () => console.log('Listengning on port 8080'))