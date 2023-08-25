import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export class CartManager {
    constructor(filename = 'Carts.json') {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        this.path = path.resolve(__dirname, '../Data', filename);
    }

    // Obtener todos los carritos
    getCarts = async () => {
        let carts;
        const data = await fs.promises.readFile(this.path, 'utf-8');
        carts = JSON.parse(data);
        return carts;
    }

    // Obtener un carrito por su ID
    getCartById = async (cartId) => {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id == cartId);
    }

    // Método para crear un nuevo carrito
    createCart = async () => {
        if (!fs.existsSync(this.path)) {
            // Si el archivo no existe, crea un archivo con un array vacío
            await fs.promises.writeFile(this.path, JSON.stringify([]));
        }

        let carts = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
        // obtener el último id utilizado
        const cartId = carts.length > 0 ? carts[carts.length - 1].id : 0;

        const newCart = {
            id: cartId + 1,
            products: []
        };

        carts.push(newCart);
        await this.updateCarts(carts);

        return newCart;
    }

    // Agregar productos al carrito
    addProductToCart = async (cartId, productId) => {
        const carts = await this.getCarts();
        // Buscar el carrito por su ID
        const cartIndex = carts.findIndex(cart => cart.id == cartId);

        if (cartIndex === -1) {
            throw new Error(`Error addProductToCart: No se encontró el carrito con el ID (${cartId}).`);
        }

        const cart = carts[cartIndex];

        if (!cart || !cart.products) {
            throw new Error(`Error addProductToCart: El carrito con el ID (${cartId}) no tiene una propiedad 'products'.`);
        }

        // Verificar si el producto ya existe en el carrito
        const existingProductIndex = cart.products.findIndex(product => product.id === productId);

        if (existingProductIndex !== -1) {
            // El producto ya existe en el carrito, incrementar la cantidad
            cart.products[existingProductIndex].quantity += 1;
        } else {
            // El producto no existe en el carrito, agregarlo como un nuevo objeto
            cart.products.push({
                id: productId,
                quantity: 1
            });
        }

        // Reemplazar el carrito actualizado en la lista de carritos
        carts[cartIndex] = cart;
        await this.updateCarts(carts);

        return `Producto con ID (${productId}) agregado al carrito con ID (${cartId}) exitosamente.`;
    }

    // Eliminar un carrito por su ID
    deleteCartById = async (cartId) => {
        let carts = await this.getCarts();
        carts = carts.filter(cart => cart.id !== cartId);
        await this.updateCarts(carts);
    }

    // Método para actualizar los carritos
    updateCarts = async (carts) => {
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
    }
}
