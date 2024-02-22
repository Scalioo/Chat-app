import  { Request, Response } from "express";
const { jwtSign } = require('../jwt/jwt')
const bcrypt = require('bcrypt');
const prisma = require('../../db/prisma')
import { v4 as uuidv4 } from "uuid";
require('dotenv').config()
export interface USER {
    name : string ;
    password?:string;
    id : any ;
    userid : number ;

}




exports.attemptlogin = async (req: Request, res: Response) => {
    const username : string = req.body.username ;
    const potentialLogin : USER = await prisma.user.findUnique({
        where:{
            name: username ,
        },
        select:{
            name: true , 
            password: true ,
            id : true ,
            userid : true ,
        }
    })
    if (!potentialLogin){
        res.json({ loggedIn:false , status: "Wrong username or password"})
        return ;
    }
    const isvalid : boolean = await bcrypt.compare(req.body.password,potentialLogin.password)
    if (!isvalid){
        res.json({ loggedIn:false , status: "Wrong username or password"})
        return ;
    }
    jwtSign({
        name : potentialLogin.name ,
        id : potentialLogin.id ,
        userid : potentialLogin.userid ,
    }, process.env.JWT_SECRET,
    {expiresIn : '1d' }  , 
    ).then(( token : any)=>{
        res.json({ loggedIn:true , token})
    }).catch((err : Error)=>{
        res.json({ loggedIn : false , status : 'Try Again Later '})
    })}

exports.attemptsignup = async (req: Request, res: Response) => {
    const username : string = req.body.username ;    
    const existingUser = await prisma.user.findUnique({
        where:{
            name: username 
        }
    });
    if ( ! existingUser ){
        const hashedPass = await bcrypt.hash(req.body.password,10);
        const newUser : USER = await  prisma.user.create( {
            data:{
                name: username,
                password:hashedPass,
                userid : uuidv4()
            } , 
            select:{
                name: true , 
                id : true ,
                userid: true ,
            }
        })
        jwtSign({
            name : newUser.name ,
            id : newUser.id ,
            userid : newUser.userid ,
        }, process.env.JWT_SECRET,
        {expiresIn : '1d' }  , 
        ).then(( token : any)=>{
            res.json({ loggedIn:true , token})
        }).catch((err : Error)=>{
            res.json({ loggedIn : false , status : 'Try Again Later '})
        })
       
     }
     res.json({ loggedIn: false , status: "Username Taken"})
    
}
