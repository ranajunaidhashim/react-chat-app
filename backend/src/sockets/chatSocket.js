import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
import { config } from "dotenv";
config();

export const chatSocket = (io) => {

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        try {
            socket.user = jwt.verify(token, process.env.JWT_SECRET);
            next();
        } catch {
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", async (socket) => {
        console.log(`Client connected: ${socket.user.username}`);
        const history = await Message.find()
            .sort({ timestamp: 1 })
            .limit(50)
            .populate("author", "username");
        socket.emit("chat-history", history);


        socket.on('send-message', async ({ message }) => {
            const msg = await Message.create({
                author: socket.user.userId,
                text: message,
            });
            const payload = {
                author: socket.user.username,
                text: msg.text,
                timestamp: msg.timestamp,
            };
            io.emit("receive-message", payload);
        })

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.user.username}`);
        })

    })
}