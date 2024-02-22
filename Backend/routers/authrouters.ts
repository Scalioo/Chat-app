import express, { Request, Response } from "express";

const validateform = require('../controllers/Authetication/validateform')
const router = express.Router();
const ratelimiter  = require('../controllers/Authetication/ratelimit')
const {  attemptlogin , attemptsignup} = require("../controllers/Authetication/authcontrollers")
const  LoginHandler  = require('../controllers/Authetication/LoginHandler')
const { getJwt , jwtVerify } = require('../controllers/jwt/jwt')
router
    .route("/login")
    .get(async (req : Request ,  res : Response) => {
      const token = getJwt(req);
    
      if (!token) {
        res.json({ loggedIn: false });
        return;
      }
    
      jwtVerify(token, process.env.JWT_SECRET)
        .then( () => {
          res.json({ loggedIn: true, token });
        })
        .catch(() => {
          res.json({ loggedIn: false });
        });
    })
    .post( validateform , ratelimiter(60,10) ,attemptlogin )


router.post("/register", validateform , ratelimiter(60,10) , attemptsignup )

module.exports = router;
