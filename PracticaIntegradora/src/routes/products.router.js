import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

const productsRouter = Router();
const PM = new ProductManager();

productsRouter.get("/", async (req, res) => {
    const products = await PM.getProducts();
    let { limit } = req.query;
    res.send({ products: limit ? products.slice(0, limit) : products });
});

productsRouter.get("/:pid", async (req, res) => {
    let pid = req.params.pid;
    const products = await PM.getProductById(pid);

    res.send({ products });
});

productsRouter.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    const requiredFields = [
        { value: title, error: "Error! No se cargó el campo Title!" },
        { value: description, error: "Error! No se cargó el campo Description!" },
        { value: code, error: "Error! No se cargó el campo Code!" },
        { value: price, error: "Error! No se cargó el campo Price!" },
        { value: stock, error: "Error! No se cargó el campo Stock!" },
        { value: category, error: "Error! No se cargó el campo Category!" },
        { value: thumbnails, error: "Error! No se cargó el campo Thumbnails!" },
    ];

    const validationError = validateFields(requiredFields);
    if (validationError) {
        sendError(res, validationError);
        return;
    }

    status = !status && true;

    if (!Array.isArray(thumbnails) || thumbnails.length === 0) {
        sendError(res, "Error! Debe ingresar al menos una imagen en el Array Thumbnails!");
        return;
    }

    if (await PM.addProduct({ title, description, code, price, status, stock, category, thumbnails })) {
        sendSuccess(res, "El Producto se agregó correctamente!");
    } else {
        res.status(500).send({ status: "error", message: "Error! No se pudo agregar el Producto!" });
    }
});

productsRouter.put("/:pid", async (req, res) => {
    const pid = req.params.pid;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    const requiredFields = [
        { value: title, error: "Error! No se cargó el campo Title!" },
        { value: description, error: "Error! No se cargó el campo Description!" },
        { value: code, error: "Error! No se cargó el campo Code!" },
        { value: price, error: "Error! No se cargó el campo Price!" },
        { value: stock, error: "Error! No se cargó el campo Stock!" },
        { value: category, error: "Error! No se cargó el campo Category!" },
        { value: thumbnails, error: "Error! No se cargó el campo Thumbnails!" },
    ];

    const validationError = validateFields(requiredFields);
    if (validationError) {
        sendError(res, validationError);
        return;
    }

    status = !status && true;

    if (!Array.isArray(thumbnails) || thumbnails.length === 0) {
        sendError(res, "Error! Debe ingresar al menos una imagen en el Array Thumbnails!");
        return;
    }

    if (await PM.updateProduct(pid, { title, description, code, price, status, stock, category, thumbnails })) {
        sendSuccess(res, "El Producto se actualizó correctamente!");
    } else {
        res.status(500).send({ status: "error", message: "Error! No se pudo actualizar el Producto!" });
    }
});

productsRouter.delete("/:pid", async (req, res) => {
    let pid = req.params.pid;

    if (await PM.deleteProduct(pid)) {
        res.send({ status: "ok", message: "El Producto se eliminó correctamente!" });
    } else {
        res.status(500).send({ status: "error", message: "Error! No se pudo eliminar el Producto!" });
    }
});

const sendError = (res, message) => {
    res.status(400).send({ status: "error", message });
};

const sendSuccess = (res, message) => {
    res.send({ status: "ok", message });
};

const validateFields = (fields) => {
    for (const field of fields) {
        if (!field.value) {
            return field.error;
        }
    }
    return null;
};

export default productsRouter;