import express from "express";
import http from 'http'
import { Server } from "socket.io";
import cors from 'cors';
import { chatSocket } from './sockets/chatSocket.js';
import rootRoute from './routes/root.route.js';
import { config } from "dotenv";
import { connectDb } from "./config/db.js";
import authRoute from './routes/auth.route.js';
import usersRoute from './routes/users.route.js';


config();
await connectDb();
const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.static("public"));
app.use("/", rootRoute);
app.use("/auth", authRoute);
app.use("/users", usersRoute);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

chatSocket(io);



const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`✅ server running on PORT:${PORT}`)
})




