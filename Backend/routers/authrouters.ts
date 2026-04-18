import express, { Request, Response } from "express";
import validateform from '../controllers/Authetication/validateform';
import ratelimiter from '../controllers/Authetication/ratelimit';
import { attemptlogin, attemptsignup } from "../controllers/Authetication/authcontrollers";
import { getJwt, jwtVerify } from '../controllers/jwt/jwt';

const router = express.Router();

router.route("/login")
  .get(async (req: Request, res: Response) => {
    const token = getJwt(req);

    if (!token) {
      return res.json({ loggedIn: false });
    }

    try {
      const decoded = await jwtVerify(token, process.env.JWT_SECRET!);
      res.json({ loggedIn: true, token, ...decoded });
    } catch (err) {
      res.json({ loggedIn: false });
    }
  })
  .post(validateform, ratelimiter(60, 10), attemptlogin);

router.post("/register", validateform, ratelimiter(60, 10), attemptsignup);

export default router;
