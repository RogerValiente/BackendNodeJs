import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

export class ProductManager {
    constructor(filename = 'test.json') {
        // Consigue el directorio del archivo actual
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        // Resuelve la ruta en relación a este archivo
        this.path = path.resolve(__dirname, './data', filename);
    }
    // Obtener todos los productos
    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, "utf-8");

            return JSON.parse(data);
        } else {
            // Si el archivo no existe, crea un archivo con un array vacío
            await fs.promises.writeFile(this.path, JSON.stringify([]));
            return [];
        }
    }
    // Obtener producto por id
    getProductById = async (id) => {
        console.log(id);
        const products = await this.getProducts();
        const product = products.find((product) => product.id === id);
        if (!product) return `Error getProductById: Producto con el id (${id}), no encontrado.`;
        return product;
    };

    // Agregar producto
    addProduct = async (product) => {
        // validar que todos los campos estén presentes
        const requiredFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category'];
        if (!requiredFields.every(field => product.hasOwnProperty(field))) {
            throw new Error('Error addProduct: Todos los campos son obligatorios, excepto thumbnail.');
        }
        // Agregar un array vacío si no está presente
        if (!product.hasOwnProperty('thumbnails')) {
            product.thumbnails = [];
        }
        // Validar que 'thumbnail' sea un array de strings si esta presente
        else if (product.hasOwnProperty('thumbnails') && product.thumbnails !== null && (!Array.isArray(product.thumbnails) || !product.thumbnails.every(item => typeof item === 'string'))) {
            throw new Error('Error addProduct: El campo thumbnails, si está presente, debe ser un array de strings.');
        }

        const products = await this.getProducts();
        // Verificar si ya existe un producto con el mismo code
        const existingProduct = products.find(item => item.code === product.code);

        if (existingProduct) {
            throw new Error(`Error addProduct: El producto con el code (${product.code}) ya existe.`);
        } else {
            // obtener el último id utilizado
            const productId = products.length > 0 ? products[products.length - 1].id : 0;
            product.id = productId + 1;
            product.status = true;

            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products));

            return `Producto con id (${product.id}) creado exitosamente.`;
        }
    }
    // Actualizar producto
    updateProduct = async (productId, updatedProduct) => {
        const products = await this.getProducts();

        // Buscar el producto por su ID
        const productIndex = products.findIndex(product => product.id == productId);
        if (productIndex === -1) {
            throw new Error(`Error updateProduct: No se encontró el producto con el ID (${productId}).`);
        }

        const productToUpdate = products[productIndex];

        // validar que todos los campos estén presentes
        const requiredFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category'];
        if (!requiredFields.every(field => updatedProduct.hasOwnProperty(field))) {
            throw new Error('Error updateProduct: Todos los campos son obligatorios, excepto thumbnail.');
        }

        // Agregar un array vacío si no está presente 'thumbnails'
        if (!updatedProduct.hasOwnProperty('thumbnails')) {
            updatedProduct.thumbnails = [];
        }
        // Validar que 'thumbnail' sea un array de strings si esta presente
        else if (updatedProduct.hasOwnProperty('thumbnails') && updatedProduct.thumbnails !== null && (!Array.isArray(updatedProduct.thumbnails) || !updatedProduct.thumbnails.every(item => typeof item === 'string'))) {
            throw new Error('Error addProduct: El campo thumbnails, si está presente, debe ser un array de strings.');
        }

        // Actualizar solo las propiedades que son diferentes en el objeto original
        Object.keys(updatedProduct).forEach(key => {
            if (productToUpdate.hasOwnProperty(key) && productToUpdate[key] !== updatedProduct[key]) {
                productToUpdate[key] = updatedProduct[key];
            }
        });

        // Reemplazar el producto actualizado en la lista de productos
        products[productIndex] = productToUpdate;
        await fs.promises.writeFile(this.path, JSON.stringify(products));

        return `Producto con id (${productId}) actualizado exitosamente.`;
    }

    //Eliminar producto
    deleteProduct = async (id) => {
        const products = await this.getProducts();
        const initialLength = products.length;

        // filtrar productos que no tengan el id especificado
        const updatedProducts = products.filter(product => product.id !== id);

        if (updatedProducts.length !== initialLength) {
            await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts));

            return `Producto con id (${id}) eliminado exitosamente.`;
        } else {
            throw new Error(`Error deleteProduct: El producto con el id (${id}) no existe.`);
        }
    }
}
