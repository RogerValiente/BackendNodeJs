import mongoose from "mongoose";
import { messageModel } from "../dao/models/message.model.js"

class ChatManager {
    getMessages = async () => {
        try {
            const message = await messageModel.find().lean();
            return message;
        } catch (error) {
            throw new Error(`Error getMessage: ${error.message}`);
        }
    }

    createMessage = async (message) => {
        return await messageModel.create(message);
    }
}

export default ChatManager;