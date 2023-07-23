import fs from "fs";

export class ProductManager {
    constructor(path = './Test.json') {
        this.path = path;
    }
    // Obtener todos los productos
    getProducts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(data);
            } else {
                // Si el archivo no existe, crea un archivo con un array vacío
                await fs.promises.writeFile(this.path, JSON.stringify([]));
                return [];
            }
        } catch (error) {
            throw new Error(`Error getProducts: ${error.message}`);
        }
    }
    // Obtener producto por id
    getProductById = async (id) => {
        try {
            const products = await this.getProducts();
            const product = products.find((product) => product.id == id);
            if (!product) return `Error getProductById: Producto con el id (${id}), no encontrado.`;
            return product;
        } catch (error) {
            throw new Error(`Error getProductById: ${error.message}`);
        }
    };

    // Agregar producto
    addProduct = async (product) => {
        try {
            // validar que todos los campos estén presentes
            const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
            if (!requiredFields.every(field => product.hasOwnProperty(field))) {
                throw new Error('Error addProduct: Todos los campos son obligatorios.');
            }

            const products = await this.getProducts();
            // buscar si ya existe un producto con el mismo code
            const existingProduct = products.find(item => item.code === product.code);

            if (existingProduct) {
                throw new Error(`Error addProduct: El producto con el code (${product.code}) ya existe.`);
            } else {
                // obtener el último id utilizado
                const productId = products.length > 0 ? products[products.length - 1].id : 0;
                product.id = productId + 1;

                products.push(product);
                await fs.promises.writeFile(this.path, JSON.stringify(products));

                return `Producto con id (${product.id}) creado exitosamente.`;
            }
        } catch (error) {
            throw new Error(`Error addProduct: ${error.message}`);
        }
    }
    // Actualizar producto
    updateProduct = async (product) => {
        try {
            // Validar que el producto tenga un id
            if (!product.id) {
                throw new Error('Error updateProduct: Debe indicar el id del producto que desea actualizar.');
            }

            // Obtener todos los productos
            const products = await this.getProducts();

            // Buscar el índice del producto en el arreglo usando un objeto o mapa para una búsqueda más rápida
            const productIndex = products.findIndex(item => item.id === product.id);

            if (productIndex !== -1) {
                // Actualizar el producto con los nuevos valores
                const updatedProduct = {
                    ...products[productIndex],
                    ...product,
                };
                products[productIndex] = updatedProduct;

                // Guardar todos los productos actualizados en el archivo
                await fs.promises.writeFile(this.path, JSON.stringify(products));

                return `Producto con id (${updatedProduct.id}) actualizado exitosamente.`;
            } else {
                throw new Error(`Error updateProduct: El producto con el id (${product.id}) no existe.`);
            }
        } catch (error) {
            throw new Error(`Error updateProduct: ${error.message}`);
        }
    };

    //Eliminar producto
    deleteProduct = async (id) => {
        try {
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
        } catch (error) {
            throw new Error(`Error deleteProduct: ${error.message}`);
        }
    }
}