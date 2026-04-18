import jwt from "jsonwebtoken";
import { Request } from "express";
import dotenv from "dotenv";

dotenv.config();

export const jwtSign = (payload: any, secret: string, options?: jwt.SignOptions): Promise<string> =>
  new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options || {}, (err: Error | null, token: string | undefined) => {
      if (err) reject(err);
      resolve(token as string);
    });
  });

export const jwtVerify = (token: string, secret: string): Promise<any> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });

export const getJwt = (req: Request): string | undefined => 
  req.headers["authorization"]?.split(" ")[1];