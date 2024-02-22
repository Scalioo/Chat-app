import { NextFunction } from "express";

const { jwtVerify } = require("../jwt/jwt");
require("dotenv").config();

const authorizeUser = (socket : any, next : NextFunction) => {
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
};

module.exports = authorizeUser;