import express, { Express, NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import cors from "cors";
import { message } from "./controllers/socket/socketcontroller";
const authRouter = require("./routers/authrouters")
const { jwtVerify } = require('./controllers/jwt/jwt')
const corssetup  = require('./controllers/sessioncontroller')
const { addfriend , initializeUser , onDisconnect , message , dm} = require('./controllers/socket/socketcontroller')
const { authorizeUser} = require('./controllers/socket/Userauthorization')
require("dotenv").config();

const app: Express = express();
const server = require("http").createServer(app);
const io = new Server (server,{
    cors:corssetup    
})


app.use(express.json());
app.use(cors(corssetup))

app.use("/auth", authRouter)
io.use((socket : any, next ) => {
  const token = socket.handshake.auth.token;
  jwtVerify(token, process.env.JWT_SECRET)
    .then((decoded : any) => {
      socket.user = { ...decoded };      
      next();
    })
    .catch((err : Error) => {
      console.log("Bad request!", err);
      next(new Error("Not authorized"));
    });
})
io.on("connect", ( socket : any ) =>{
    initializeUser(socket)
    socket.on("add_friend",(friendname:string , cb:any)=> addfriend(socket,friendname,cb))
    socket.on('direct', (message : message) => dm(socket,message))
    socket.on("disconnecting" , () => onDisconnect(socket) )
  })
    

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});


