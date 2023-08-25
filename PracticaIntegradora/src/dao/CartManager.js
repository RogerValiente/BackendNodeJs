import { cartModel } from "./models/cart.model.js";

class CartManager {

    async getCarts() {
        let carsData = await cartModel.find().lean();
        console.log(carsData);
        return carsData;
    }

    async getCartById(id) {
        return await cartModel.findById(id).lean() || null;
    }

    async createCart() {
        await cartModel.create({ products: [] });
        return true;
    }

    async addProductToCart(cid, pid) {
        try {
            const cart = await this.getCartById(cid);
            if (cart) {
                const product = cart.products.find(item => item.product === pid);
                if (product) {
                    product.quantity += 1;
                } else {
                    cart.products.push({ product: pid, quantity: 1 });
                }

                await cartModel.updateOne({ _id: cid }, { products: cart.products });
                console.log("Product added!");

                return true;
            } else {
                console.log("Cart not found!");
                return false;
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
            return false;
        }
    }

}

export default CartManager;