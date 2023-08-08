const socket = io();

// Obtener referencia al formulario
const productForm = document.getElementById('productForm');

socket.on('connect', () => {
    console.log('Conectado al servidor');
});

socket.on('getRealTimeProducts', (products) => {
    const productList = document.getElementById('realTimeProductList');
    productList.innerHTML = '';

    products.forEach((product) => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        li.innerText = `
        ID: ${product.id}
      Título: ${product.title}
      Descripción: ${product.description}
      Código: ${product.code}
      Precio: ${product.price}
      Estado: ${product.status}
      Stock: ${product.stock}
      Categoría: ${product.category}
      Thumbnails: ${product.thumbnails}    
    `;
        const button = document.createElement('button');
        button.innerText = 'Eliminar';
        button.addEventListener('click', () => {
            deleteProduct(product.id);
        });

        li.appendChild(span);
        li.appendChild(button);
        productList.appendChild(li);
    });
});

// Escuchar el evento de envío del formulario
productForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    // Obtener los valores de los campos del formulario
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const code = document.getElementById('code').value;
    const price = document.getElementById('price').value;
    const status = document.getElementById('status').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;
    const thumbnails = [];

    // Crear un objeto con los datos del producto
    const productData = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
    };

    // Enviar los datos del producto al servidor
    socket.emit('createProduct', productData);

    // Limpiar los campos del formulario
    productForm.reset();
});

function deleteProduct(productId) {
    socket.emit('deleteProduct', productId);
}

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
});