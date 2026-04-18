import { Request, Response } from "express";
import { jwtSign } from '../jwt/jwt';
import bcrypt from 'bcrypt';
import prisma from '../../db/prisma';
import { v4 as uuidv4 } from "uuid";
import dotenv from 'dotenv';

dotenv.config();

export interface USER {
  name: string;
  password?: string;
  id: any;
  userid: string; // Changed to string to match uuidv4
}

export const attemptlogin = async (req: Request, res: Response) => {
  const username: string = req.body.username;
  try {
    const potentialLogin: any = await prisma.user.findUnique({
      where: {
        name: username,
      },
      select: {
        name: true,
        password: true,
        id: true,
        userid: true,
      }
    });

    if (!potentialLogin) {
      return res.json({ loggedIn: false, status: "Wrong username or password" });
    }

    const isValid: boolean = await bcrypt.compare(req.body.password, potentialLogin.password);
    if (!isValid) {
      return res.json({ loggedIn: false, status: "Wrong username or password" });
    }

    const token = await jwtSign({
      name: potentialLogin.name,
      id: potentialLogin.id,
      userid: potentialLogin.userid,
    }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    res.json({ loggedIn: true, token });
  } catch (err) {
    console.error("Login Error:", err);
    res.json({ loggedIn: false, status: 'Try Again Later' });
  }
};

export const attemptsignup = async (req: Request, res: Response) => {
  const username: string = req.body.username;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        name: username
      }
    });

    if (!existingUser) {
      const hashedPass = await bcrypt.hash(req.body.password, 10);
      const newUser: any = await prisma.user.create({
        data: {
          name: username,
          password: hashedPass,
          userid: uuidv4()
        },
        select: {
          name: true,
          id: true,
          userid: true,
        }
      });

      const token = await jwtSign({
        name: newUser.name,
        id: newUser.id,
        userid: newUser.userid,
      }, process.env.JWT_SECRET!, { expiresIn: '1d' });

      return res.json({ loggedIn: true, token });
    }

    res.json({ loggedIn: false, status: "Username Taken" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.json({ loggedIn: false, status: 'Try Again Later' });
  }
};
