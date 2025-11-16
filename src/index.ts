import express from "express";
import { Server } from "socket.io";
import http from "http";
import { Socket } from "socket.io";
import { UserManager } from "./managers/UserManager";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://vibe-chat-pink.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userManager = new UserManager();

io.on("connection", (socket: Socket) => {
  const name = socket.handshake.query.name as string;
  console.log(`a user connected: ${name}`);
  userManager.addUser(name || "anonymous", socket);

  socket.on("disconnect", () => {
    console.log("disconnected from :", socket.id, socket.data?.username);
    userManager.removeUser(socket.id);
  });
});

// REQUIRED FOR RENDER:
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
