import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    idCart: mongoose.Schema.Types.ObjectId,
    products: [mongoose.Schema.Types.Mixed]
});

export const cartModel = mongoose.model("carts", cartSchema)