import { NextFunction , Request , Response } from "express"

const redisClient = require('../../redis')



const ratelimiter = (seconds : number , amount : number ) =>
    async (req:Request , res:Response , next: NextFunction) =>{
    const ip = req.socket.remoteAddress ; 
    const [response]  = await redisClient.multi().incr(ip).expire(ip, seconds).exec()
    console.log(response[1]);
    
    if (!(response[1] > amount )){
        next()
        return ;
    }
    res.json({ loggedIn:false , status: "Slow down ! Try again in a minute "})


}

module.exports = ratelimiter