import fs from "fs";

class ProductManager {
    constructor(path = './Test.json') {
        this.path = path;
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
        const products = await this.getProducts();
        const product = products.find((product) => product.id === id);
        if (!product) return `Error getProductById: Producto con el id (${id}), no encontrado.`;
        return product;
    };

    // Agregar producto
    addProduct = async (product) => {
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
    }
    // Actualizar producto
    updateProduct = async (product) => {
        // validar que el producto tenga un id
        if (!product.id) {
            throw new Error('Error updateProduct: Debe indicar el id del producto que desea actualizar.');
        }

        const products = await this.getProducts();
        // buscar si existe un producto
        const productIndex = products.findIndex(item => item.id === product.id);

        if (productIndex !== -1) {
            products[productIndex].title = product.title;
            products[productIndex].description = product.description;
            products[productIndex].price = product.price;
            products[productIndex].thumbnail = product.thumbnail;
            products[productIndex].code = product.code;
            products[productIndex].stock = product.stock;

            await fs.promises.writeFile(this.path, JSON.stringify(products));

            return `Producto con id (${products[productIndex].id}) actualizado exitosamente.`;
        }
        else {
            throw new Error(`Error updateProduct: El producto con el id (${product.id}) no existe.`);
        }
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

(async () => {
    const manager = new ProductManager('./ProductsAsync.json');
    console.log(manager.path);

    console.log(await manager.getProducts());
    //Productos
    try {
        let product = {
            title: 'producto prueba',
            description: 'Este es un producto prueba',
            price: 200,
            thumbnail: 'Sin imagen',
            code: 'abc123',
            stock: 25
        }
        let product2 = {
            title: 'producto prueba2',
            description: 'Este es un producto prueba2',
            price: 100,
            thumbnail: 'Sin imagen2',
            code: 'abcPrueba2',
            stock: 15
        }
        //Crear producto
        console.log(await manager.addProduct(product));
        console.log(await manager.addProduct(product2));
        console.log(await manager.getProducts());
        //consultar productos por id
        console.log(await manager.getProductById(2));

        let updateProduct = {
            title: 'producto prueba',
            description: 'Este es un producto prueba',
            price: 200,
            thumbnail: 'Sin imagen',
            code: 'Prueba',
            stock: 25,
            id: 1
        }
        //Actualizar producto
        console.log(await manager.updateProduct(updateProduct));
        console.log(await manager.getProducts());
        //Eliminar producto
        console.log(await manager.deleteProduct(2));
        console.log(await manager.getProducts());

    } catch (error) {
        console.error(error.message);
    }

})();
