import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'; 
const secretKey = 'rishabh'; 

const authenticate = (req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers['authorization'] ?? "";
    if(!token){
        return res.status(401).send('access denied, token invalid');
    }

    try{
        const decoded = jwt.verify(token,secretKey);
        //@ts-ignore: TODO; how to fix this error
        req.userId= decoded;
        next();
    }catch(error){
        return res.status(400).send('token authentication failed');
    }

}

