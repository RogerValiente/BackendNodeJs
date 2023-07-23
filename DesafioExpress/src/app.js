import express from 'express';
import { ProductManager } from './ProductManager.js';

const app = express();
app.use(express.json());
const puerto = 8080;

const dataProducts = new ProductManager('./products.json');
(async () => {
    //Productos
    try {
        let product = {
            title: 'producto 1',
            description: 'Este es un producto prueba 1',
            price: 200,
            thumbnail: 'Sin imagen1',
            code: 'abc123',
            stock: 25
        }
        let product2 = {
            title: 'producto 2',
            description: 'Este es un producto prueba 2',
            price: 100,
            thumbnail: 'Sin imagen2',
            code: 'abcPrueba2',
            stock: 15
        }
        let product3 = {
            title: 'producto 3',
            description: 'Este es un producto prueba 3',
            price: 200,
            thumbnail: 'Sin imagen3',
            code: 'dgtPrueba3',
            stock: 5,
        }
        //Crear productos
        await dataProducts.addProduct(product);
        await dataProducts.addProduct(product2);
        await dataProducts.addProduct(product3);
    } catch (error) {
        console.error(error.message);
    }
})();

app.get('/products', async (req, res) => {
    try {
        const products = await dataProducts.getProducts();
        const limit = req.query.limit;

        if (limit) {
            const limitedProducts = products.slice(0, Number(limit));
            res.json({ products: limitedProducts });
        } else {
            res.json({ products });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await dataProducts.getProductById(pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(puerto, () => console.log(`Listengning on port ${puerto}`))