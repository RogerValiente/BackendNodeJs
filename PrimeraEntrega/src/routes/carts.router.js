import express from 'express';
import { CartManager } from '../CartManager/CartManager.js';

const cartManager = new CartManager('Carts.json');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// Listar productos de un carrito específico
router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            res.json({ products: cart.products });
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar un producto a un carrito específico
router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = 1;

    try {
        const result = await cartManager.addProductToCart(cartId, productId, quantity);
        res.status(201).json({ message: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
