import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import { ProductManager } from './ProductManager.js';

const app = express();

app.use(express.static(`${__dirname}/public`));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);

const server = app.listen(8081, () => console.log("Server running"));
const io = new Server(server);
const productManager = new ProductManager('products.json');

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado en /realtimeproducts');

    try {
        const products = await productManager.getProducts();
        socket.emit('getRealTimeProducts', products);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }

    socket.on('createProduct', async (productData) => {
        try {
            console.log(productData);
            const newProduct = await productManager.addProduct(productData);
            console.log('Nuevo producto creado:', newProduct);

            const updatedProducts = await productManager.getProducts();
            socket.emit('getRealTimeProducts', updatedProducts);
        } catch (error) {
            console.error('Error al crear el producto:', error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            const result = await productManager.deleteProduct(productId);
            console.log(result);

            const updatedProducts = await productManager.getProducts();
            socket.emit('getRealTimeProducts', updatedProducts);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    });
});
