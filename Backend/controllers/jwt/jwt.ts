
require("dotenv").config();
import express, { Request, Response } from "express";

const jwt = require("jsonwebtoken");

const jwtSign = (payload : any, secret : any, options : any) =>
  new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err : Error, token : any) => {
      if (err) reject(err);
      resolve(token);
    });
  });

const jwtVerify = (token : any, secret : any) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err : Error, decoded : any) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });

const getJwt = (req : Request)=> req.headers["authorization"]?.split(" ")[1];

module.exports = { jwtSign, jwtVerify, getJwt };