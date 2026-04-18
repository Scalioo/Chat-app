import { NextFunction, Request, Response } from "express";
import redisClient from '../../redis';

const ratelimiter = (seconds: number, amount: number) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    if (!ip) return next();

    const results = await redisClient.multi().incr(ip).expire(ip, seconds).exec();
    if (!results || !results[0]) return next();

    // ioredis return format for exec is [[err, data], [err, data]]
    const [err, count] = results[0] as [Error | null, number];

    if (err || !(count > amount)) {
      next();
      return;
    }
    
    res.json({ loggedIn: false, status: "Slow down! Try again in a minute" });
  };

export default ratelimiter;