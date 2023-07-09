class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {

    constructor() {
        this.products = [];
    }

    // Obtener todos los productos
    getProducts = () => this.products;

    // Obtener producto por id
    getProductById = (id) => {
        const product = this.products.find((product) => product.id === id);
        if (!product) console.log(`Error: Producto con el id (${id}), no encontrado.`);
        return product;
    };

    //Agregar productos
    addProduct(product) {
        if (!(product instanceof Product)) {
            console.log("Error: El objeto no es una instancia de la clase Product.");
            return;
        }

        const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
        const missingFields = requiredFields.filter(field => !(field in product) || product[field] === undefined || product[field] === '');

        if (missingFields.length > 0) {
            console.log(`Error: Faltan los siguientes campos requeridos: ${missingFields.join(', ')}.`);
            return;
        }

        const existingProduct = this.products.find(p => p.code === product.code);
        if (existingProduct) {
            console.log(`Error: El producto con el código (${product.code}) ya existe.`);
            return;
        }

        const productId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
        product.id = productId + 1;

        this.products.push(product);
    }
}

const manager = new ProductManager();

console.log(manager.products);

// Crear productos
const product1 = new Product("Producto 1", "Descripción del producto 1", 100, "/ruta/imagen1.jpg", "001", 10);
manager.addProduct(product1);

const product2 = new Product("Producto 2", "Descripción del producto 2", 200, "/ruta/imagen2.jpg", "002", 20);
manager.addProduct(product2);

//Obtener todos los productos
console.log(manager.getProducts());

//Producto sin todo los campos
const product3 = new Product("Producto 3", "Descripción del producto 3", 150, "003");
manager.addProduct(product3);

//Producto con el code repetido
const product4 = new Product("Producto 4", "Descripción del producto 4", 300, "/ruta/imagen4.jpg", "002", 20);
manager.addProduct(product4);

//Buscar producto por id
console.log(manager.getProductById(2));
//Buscar un id de producto que no existe
console.log(manager.getProductById(100));