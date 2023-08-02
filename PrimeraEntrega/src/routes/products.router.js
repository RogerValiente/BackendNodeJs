import express from 'express';
import { ProductManager } from '../ProductManager/ProductManager.js';

const productManager = new ProductManager('Products.json');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
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

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const product = await productManager.getProductById(Number(pid));
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const result = await productManager.addProduct(req.body);
        res.status(201).send(result);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const result = await productManager.updateProduct(pid, req.body);
        res.send(result);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

router.delete('/:pid', async (req, res) => {
    const pid = Number(req.params.pid);
    try {
        const result = await productManager.deleteProduct(pid);
        res.send(result);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

export default router;
