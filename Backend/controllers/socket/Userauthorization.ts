import { NextFunction } from "express";
import { jwtVerify } from "../jwt/jwt";
import dotenv from "dotenv";
import { AuthenticatedSocket } from "../../types";

dotenv.config();

export const authorizeUser = (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
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
      console.log("Bad request!", err);
      next(new Error("Not authorized"));
    });
};