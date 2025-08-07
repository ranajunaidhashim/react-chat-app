import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
import Contact from "../models/Contact.js";
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
        const myId = socket.user.userId;

        console.log(`Client connected: ${socket.user.username}`);

        socket.join(myId);

        socket.on('load-private-history', async ({ with: otherId }) => {
            const history = await Message.find({
                $or: [
                    { author: myId, recipient: otherId },
                    { author: otherId, recipient: myId }
                ]
            })
                .sort({ timestamp: 1 })
                .limit(50)
                .populate("author", "username");

            const flat = history.map(m => ({
                author: m.author.username,
                text: m.text,
                timestamp: m.timestamp
            }));
            socket.emit("private-history", flat);
        });

        socket.on('private-message', async ({ to, text }) => {
            try {
                const m = await Message.create({
                    author: myId,
                    recipient: to,
                    text
                });

                // Update or create contact entries for both users
                await Contact.findOneAndUpdate(
                    { user: myId, contact: to },
                    { lastMessageAt: new Date() },
                    { upsert: true, new: true }
                );

                await Contact.findOneAndUpdate(
                    { user: to, contact: myId },
                    { lastMessageAt: new Date() },
                    { upsert: true, new: true }
                );

                const payload = {
                    from: socket.user.username,
                    to,
                    text: m.text,
                    timestamp: m.timestamp
                };
                io.to(to).to(myId).emit("private-message", payload);
            } catch (error) {
                console.error("Error sending private message:", error);
            }
        });

        // New endpoint to get user's recent contacts
        socket.on('get-recent-contacts', async () => {
            try {
                const contacts = await Contact.find({ user: myId })
                    .populate('contact', 'username')
                    .sort({ lastMessageAt: -1 })
                    .limit(20);

                const recentContacts = contacts.map(c => ({
                    _id: c.contact._id,
                    username: c.contact.username,
                    lastMessageAt: c.lastMessageAt
                }));

                socket.emit("recent-contacts", recentContacts);
            } catch (error) {
                console.error("Error fetching recent contacts:", error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.user.username}`);
        });

    });
}