import express, { Express } from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

// Initialize dotenv at the very top
dotenv.config();

import authRouter from "./routers/authrouters";
import { jwtVerify } from './controllers/jwt/jwt';
import { corsConfig } from './controllers/sessioncontroller';
import { 
  handleFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  initializeUser, 
  onDisconnect, 
  dm 
} from './controllers/socket/socketcontroller';
import { AuthenticatedSocket, ChatMessage } from "./types";

const app: Express = express();
app.set("trust proxy", 1);
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsConfig
});

app.use(express.json());
app.use(cors(corsConfig));

app.use("/auth", authRouter);

// Middleware for Socket.io authentication
io.use((socket: any, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Not authorized"));
  }
  
  jwtVerify(token, process.env.JWT_SECRET!)
    .then((decoded: any) => {
      socket.user = { ...decoded };
      next();
    })
    .catch((err: Error) => {
      console.log("Socket Auth Error:", err.message);
      next(new Error("Not authorized"));
    });
});

io.on("connect", (socket: any) => {
  const authSocket = socket as AuthenticatedSocket;
  console.log(`User connected: ${authSocket.user.name}`);
  
  initializeUser(socket);
  
  socket.on("add_friend", (friendName: string, cb: any) => 
    handleFriendRequest(socket, friendName, cb)
  );

  socket.on("accept_friend", (requesterName: string, cb: any) => 
    acceptFriendRequest(socket, requesterName, cb)
  );

  socket.on("decline_friend", (requesterName: string, cb: any) => 
    declineFriendRequest(socket, requesterName, cb)
  );

  socket.on("remove_friend", (friendId: string, cb: any) => 
    removeFriend(socket, friendId, cb)
  );
  
  socket.on('direct', (message: ChatMessage) => 
    dm(authSocket, message)
  );
  
  socket.on("disconnecting", () => 
    onDisconnect(authSocket)
  );
  
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user.name}`);
  });
});

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
