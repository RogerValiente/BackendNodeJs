import { Router } from "express";
import CartManager from "../dao/CartManager.js";

const cartsRouter = Router();
const cartManager = new CartManager();

cartsRouter.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.status(200).json({ carts });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los carritos" });
    }
});


cartsRouter.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            res.json({ cart: cart });
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const cart = await cartManager.getCartById(cid);

        if (cart) {
            if (await cartManager.addProductToCart(cid, pid)) {
                res.send({ status: "ok", message: "El producto se agregó correctamente al carrito!" });
            } else {
                res.status(400).send({ status: "error", message: "Error! No se pudo agregar el Producto al Carrito!" });
            }
        } else {
            res.status(400).send({ status: "error", message: "Error! No se encuentra el ID de Carrito!" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default cartsRouter;