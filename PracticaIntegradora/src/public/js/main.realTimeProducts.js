const socket = io();
const content = document.getElementById("content");

socket.on("realTimeProducts", (data) => {
    let salida = ``;

    data.forEach(item => {
        salida += `<div class="col-md-4">
            <div class="card border-0 mb-3">
                <img src="${item.thumbnails}" class="img-fluid" alt="${item.title}">
                <div class="card-body text-center">
                    <p class="card-text">${item._id}</p>
                    <p class="card-text">${item.title}<br><span class="text-success">$${item.price}</span></p>
                </div>
            </div>
        </div>`;
    });

    content.innerHTML = salida;
});

const agregarProducto = () => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const code = document.getElementById("code").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;
    const thumbnails = document.getElementById("thumbnails").value;

    const product = { title: title, description: description, price: price, code: code, stock: stock, category: category, thumbnails: thumbnails };

    if (title && description && price && code && stock && category && thumbnails) {
        const product = {
            title: title,
            description: description,
            price: price,
            code: code,
            stock: stock,
            category: category,
            thumbnails: thumbnails,
        };

        socket.emit("nuevoProducto", product);

        Swal.fire({
            icon: 'success',
            title: 'Producto Agregado',
            text: 'El producto se ha agregado correctamente.',
        });

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("price").value = "";
        document.getElementById("code").value = "";
        document.getElementById("stock").value = "";
        document.getElementById("category").value = "";
        document.getElementById("thumbnails").value = "";
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Campos Incompletos',
            text: 'Por favor complete todos los campos del producto.',
        });
    }
}

const btnAgregarProducto = document.getElementById("btnAgregarProducto");
btnAgregarProducto.onclick = agregarProducto;

const eliminarProducto = () => {
    const idProduct = document.getElementById("idProduct").value;

    if (idProduct) {
        console.log("ELIMINAR ", idProduct);
        socket.emit("eliminarProducto", idProduct);

        Swal.fire({
            icon: 'success',
            title: 'Producto Eliminado',
            text: 'El producto se ha eliminado correctamente.',
        });

        document.getElementById("idProduct").value = "";
    } else {
        Swal.fire({
            icon: 'error',
            title: 'ID del Producto Vacío',
            text: 'Por favor ingrese el ID del producto que desea eliminar.',
        });
    }
}

const btnEliminarProducto = document.getElementById("btnEliminarProducto");
console.log("FRONE ", btnEliminarProducto)
btnEliminarProducto.onclick = eliminarProducto;