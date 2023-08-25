import mongoose from "mongoose";
import { productModel } from "../dao/models/product.model.js"

class ProductManager {
    constructor() {
        this.products = [];
    }

    getProducts = async () => {
        try {
            const products = await productModel.find().lean();
            return products;
        } catch (error) {
            console.error(`Error getProducts: ${error.message}`);
            return false;
        }
    }

    getProductById = async (id) => {
        try {
            console.log(id)
            const product = await productModel.find({ _id: id }).lean();
            if (!product) return `Info getProductById: Producto con el id (${id}), no encontrado.`;
            return product;
        } catch (error) {
            console.error(`Error getProductById: ${error.message}`);
            return false;
        }
    }

    addProduct = async (product) => {
        if (this.validateCode(product.code)) {
            console.log("Error! El código ya existe en otro producto.");
            return false;
        } else {
            try {
                await productModel.create(product);
                console.log("Producto agregado exitosamente.");
                return true;
            } catch (error) {
                console.error(`Error al agregar el producto: ${error.message}`);
                return false;
            }
        }
    }

    updateProduct = async (id, product) => {
        const existProduct = await this.getProductById(id);

        if (existProduct.length > 0) {
            await productModel.updateOne({ _id: id }, product);

            return true;
        } else {
            console.log("Not found!");

            return false;
        }
    }

    deleteProduct = async (id) => {
        const existProduct = await this.getProductById(id);

        if (existProduct.length == 1) {
            await productModel.deleteOne({ _id: id })
            console.log("Product #" + id + " deleted!");

            return true;
        } else {
            console.log("Not found!");

            return false;
        }
    }

    validateCode(code) {
        return this.products.some(item => item.code === code);
    }
}

export default ProductManager;