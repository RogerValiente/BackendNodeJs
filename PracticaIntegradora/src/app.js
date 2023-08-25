import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.routes.js";
import { Server } from "socket.io";
import ProductManager from "./dao/ProductManager.js";
import ChatManager from "./dao/ChatManager.js";
import mongoose from "mongoose";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
const puerto = 8080;
const httpServer = app.listen(puerto, () => {
    console.log("Servidor Activo en el puerto: " + puerto);
});

const socketServer = new Server(httpServer);
const PM = new ProductManager();
const CM = new ChatManager();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/", viewsRouter);

mongoose.connect("mongodb+srv://rogervaliente:caZG26kcFSoK7MGq@codercluster.nbgje5q.mongodb.net/ecommerce?retryWrites=true&w=majority");

socketServer.on("connection", (socket) => {
    console.log("Nueva Conexión!");

    const products = PM.getProducts();
    socket.emit("realTimeProducts", products);

    socket.on("nuevoProducto", (data) => {
        console.log("APP", data)
        PM.addProduct(data);
        const products = PM.getProducts();
        socket.emit("realTimeProducts", products);
    });

    socket.on("eliminarProducto", (data) => {
        PM.deleteProduct(data);
        const products = PM.getProducts();
        socket.emit("realTimeProducts", products);
    });

    const io = socketServer.of("/");
    socket.on("newMessage", async (data) => {
        CM.createMessage(data);
        const messages = await CM.getMessages();
        io.emit("messages", messages);
    });
});



